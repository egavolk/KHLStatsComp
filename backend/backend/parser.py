from bs4 import BeautifulSoup
import requests
from collections import namedtuple, Counter
import pickle as pkl

class GameFields:
    GAME_ID = 'game_id'
    LEFT_TEAM = 'left_team'
    RIGHT_TEAM = 'right_team'
    DATE = 'date'
    GAME_NO = 'game_no'
    TIME = 'time'
    PLACE = 'place'

class TeamFields:
    TEAM_ID = 'team_id'
    TEAM = 'team'
    TEAM_UNIQUE = 'team_unique'
    CITY = 'city'
    LOGO = 'logo'

class Stats:
    GAMES = 'games'
    PLACE = 'place'
    WINS = 'wins'
    DRAWS = 'draws'
    WINS_OT = 'wins_ot'
    WINS_SO = 'wins_so'
    LOOSES = 'looses'
    LOOSES_OT = 'looses_ot'
    LOOSES_SO = 'looses_so'
    SCORED = 'scored'
    MISSED = 'missed'
    POINTS = 'points'
    NO_SCORED = 'no_scored'
    NO_MISSED = 'no_missed'
    PENALTY = 'penalty'
    PENALTY_AGAINST = 'penalty_against'
    POWERPLAYS = 'powerplays'
    SCORED_PP = 'scored_pp'
    PP_PERCENT = 'pp_percent'
    MISSED_PP = 'missed_pp'
    SHORTHANDEDS = 'shorthandeds'
    MISSED_SH = 'missed_sh'
    SH_PERCENT = 'sh_percent'
    SCORED_SH = 'scored_sh'


def parse_team(team_doc):
    team, city = [x.contents[0].strip() for x in team_doc.find_all('p')]
    return {
        TeamFields.TEAM_ID: team_doc['href'],
        TeamFields.TEAM: team,
        TeamFields.CITY: city,
        TeamFields.TEAM_UNIQUE: team if team != 'Динамо' else f'{team} {"МН" if city =="Минск" else "M"}',
        TeamFields.LOGO: team_doc.find('img')['src']
    }

def parse_game_info(info_doc):
    return [x.contents[0].strip() for x in info_doc.find_all('p')]

def parse_future_games_day(games_day_doc):
    date = games_day_doc.find_all('time')[0].contents[0].strip()
    games = games_day_doc.find_all('div', {'class': 'card-game card-game--calendar'})
    result = []
    for game in games:
        game_id = game.find('a')['href'].rsplit('/', 2)[0]
        game_no, time, place = parse_game_info(game.find('div', {'class': 'card-game__center'}))
        result.append({
            GameFields.GAME_ID: game_id,
            GameFields.LEFT_TEAM: parse_team(game.find('a', {'class': 'card-game__club card-game__club_left'})),
            GameFields.RIGHT_TEAM: parse_team(game.find('a', {'class': 'card-game__club card-game__club_right'})),
            GameFields.DATE: date,
            GameFields.TIME: time,
            GameFields.GAME_NO: game_no,
            GameFields.PLACE: place
        })
    return result

def parse_calendar():
    response = requests.get('https://www.khl.ru/calendar/')
    if not response.status_code == 200:
        return []
    doc = response.text

    soup = BeautifulSoup(doc, 'html.parser')
    calendar = soup.find('div', {'class': 'calendary-body'})
    games_day = calendar.find_all('div', {'class': 'calendary-body__item games_featured'})
    result = []
    for x in games_day:
        result.extend(parse_future_games_day(x))
    return {'calendar': result}


def parse_clubs():
    response = requests.get('https://www.khl.ru/clubs/')
    if not response.status_code == 200:
        return []
    doc = response.text

    soup = BeautifulSoup(doc, 'html.parser')
    clubs = soup.find_all('div', {'class': 'cardClub-card'})
    result = []
    for club in clubs:
        result.append(parse_team(club.find('a')))
    return {'clubs': result}


def parse_standings(address):
    response = requests.get(address)
    if not response.status_code == 200:
        return {}
    doc = response.text

    soup = BeautifulSoup(doc, 'html.parser')
    standings = soup.find('tbody')
    result = {}
    for row in standings.find_all('tr'):
        if row.get('class') is not None:
            continue
        element = row.find('td')
        values = row.find_all('th')
        club = '/'.join(['', 'clubs', element.find('a')['href'].split('/')[-2], ''])
        result[club] = [
            {
                'key': Stats.PLACE,
                'value': values[0].find('p').contents[0],
                'name': 'Место в таблице',
                'better': 'less'
            },
            {
                'key': Stats.GAMES,
                'value': values[1].find('p').contents[0],
                'name': 'Количество игр',
                'better': ''
            },
            {
                'key': Stats.WINS,
                'value': values[2].find('p').contents[0],
                'name': 'Количество побед',
                'better': 'more'
            },
            {
                'key': Stats.WINS_OT,
                'value': values[3].find('p').contents[0],
                'name': 'Количество побед в ОТ',
                'better': 'more'
            },
            {
                'key': Stats.WINS_SO,
                'value': values[4].find('p').contents[0],
                'name': 'Количество побед по буллитам',
                'better': 'more'
            },
            {
                'key': Stats.LOOSES_SO,
                'value': values[5].find('p').contents[0],
                'name': 'Количество поражений по буллитам',
                'better': 'less'
            },
            {
                'key': Stats.LOOSES_OT,
                'value': values[6].find('p').contents[0],
                'name': 'Количество поражений в ОТ',
                'better': 'less'
            },
            {
                'key': Stats.LOOSES,
                'value': values[7].find('p').contents[0],
                'name': 'Количество поражений',
                'better': 'less'
            },
            {
                'key': Stats.POINTS,
                'value': values[8].find('p').contents[0],
                'name': 'Количество очков',
                'better': 'more'
            },
            {
                'key': Stats.NO_SCORED,
                'value': values[9].find('p').contents[0],
                'name': 'Игры без заброшенных шайб',
                'better': 'less'
            },
            {
                'key': Stats.NO_MISSED,
                'value': values[9].find('p').contents[0],
                'name': 'Игры без пропущенных шайб',
                'better': 'more'
            },
            {
                'key': Stats.SCORED,
                'value': values[10].find('p').contents[0],
                'name': 'Заброшено шайб',
                'better': 'more'
            },
            {
                'key': Stats.MISSED,
                'value': values[11].find('p').contents[0],
                'name': 'Пропущено шайб',
                'better': 'less'
            },
            {
                'key': Stats.PENALTY,
                'value': values[12].find('p').contents[0],
                'name': 'Штраф',
                'better': 'less'
            },
            {
                'key': Stats.PENALTY_AGAINST,
                'value': values[13].find('p').contents[0],
                'name': 'Штраф соперника',
                'better': 'more'
            },
        ]

    return result

def parse_standings_all():
    return parse_standings('https://www.khl.ru/stat/teams/1154/')

def parse_standings_home():
    return parse_standings('https://www.khl.ru/stat/teams/1154/home/')

def parse_standings_road():
    return parse_standings('https://www.khl.ru/stat/teams/1154/road/')


def parse_period(address):
    response = requests.get(address)
    if not response.status_code == 200:
        return {}
    doc = response.text

    soup = BeautifulSoup(doc, 'html.parser')
    standings = soup.find('tbody')
    result = {}
    for row in standings.find_all('tr'):
        if row.get('class') is not None:
            continue
        element = row.find('td')
        values = row.find_all('th')
        club = '/'.join(['', 'clubs', element.find('a')['href'].split('/')[-2], ''])
        result[club] = [
            {
                'key': Stats.PLACE,
                'value': values[0].find('p').contents[0],
                'name': 'Место в таблице',
                'better': 'less'
            },
            {
                'key': Stats.GAMES,
                'value': values[1].find('p').contents[0],
                'name': 'Количество игр',
                'better': ''
            },
            {
                'key': Stats.WINS,
                'value': values[2].find('p').contents[0],
                'name': 'Количество побед',
                'better': 'more'
            },
            {
                'key': Stats.DRAWS,
                'value': values[3].find('p').contents[0],
                'name': 'Количество ничьих',
                'better': ''
            },
            {
                'key': Stats.LOOSES,
                'value': values[4].find('p').contents[0],
                'name': 'Количество поражений',
                'better': 'less'
            },
            {
                'key': Stats.POINTS,
                'value': values[5].find('p').contents[0],
                'name': 'Количество очков',
                'better': 'more'
            },
            {
                'key': Stats.NO_SCORED,
                'value': values[6].find('p').contents[0],
                'name': 'Игры без заброшенных шайб',
                'better': 'less'
            },
            {
                'key': Stats.NO_MISSED,
                'value': values[7].find('p').contents[0],
                'name': 'Игры без пропущенных шайб',
                'better': 'more'
            },
            {
                'key': Stats.SCORED,
                'value': values[8].find('p').contents[0],
                'name': 'Заброшено шайб',
                'better': 'more'
            },
            {
                'key': Stats.MISSED,
                'value': values[9].find('p').contents[0],
                'name': 'Пропущено шайб',
                'better': 'less'
            },
            {
                'key': Stats.PENALTY,
                'value': values[10].find('p').contents[0],
                'name': 'Штраф',
                'better': 'less'
            },
            {
                'key': Stats.PENALTY_AGAINST,
                'value': values[11].find('p').contents[0],
                'name': 'Штраф соперника',
                'better': 'more'
            },
        ]

    return result


def parse_period_1():
    return parse_period('https://www.khl.ru/stat/teams/1154/first-period/')

def parse_period_2():
    return parse_period('https://www.khl.ru/stat/teams/1154/second-period/')

def parse_period_3():
    return parse_period('https://www.khl.ru/stat/teams/1154/third-period/')


def parse_powerplay():
    response = requests.get('https://www.khl.ru/stat/teams/1154/powerplay-gf/')
    if not response.status_code == 200:
        return {}
    doc = response.text

    soup = BeautifulSoup(doc, 'html.parser')
    standings = soup.find('tbody')
    result = {}
    for row in standings.find_all('tr'):
        if row.get('class') is not None:
            continue
        element = row.find('td')
        values = row.find_all('th')
        club = '/'.join(['', 'clubs', element.find('a')['href'].split('/')[-2], ''])
        result[club] = [
            {
                'key': Stats.GAMES,
                'value': values[1].find('p').contents[0],
                'name': 'Количество игр',
                'better': ''
            },
            {
                'key': Stats.POWERPLAYS,
                'value': values[2].find('p').contents[0],
                'name': 'Количество заработанного большиинства',
                'better': 'more'
            },
            {
                'key': Stats.SCORED_PP,
                'value': values[3].find('p').contents[0],
                'name': 'Количество заработанного большиинства',
                'better': 'more'
            },
            {
                'key': Stats.PP_PERCENT,
                'value': values[4].find('p').contents[0],
                'name': 'Процент реализации большинства',
                'better': 'more'
            },
            {
                'key': Stats.MISSED_PP,
                'value': values[5].find('p').contents[0],
                'name': 'Количество пропущенных в большинстве шайб',
                'better': 'less'
            },
            {
                'key': Stats.SHORTHANDEDS,
                'value': values[6].find('p').contents[0],
                'name': 'Количество заработанного большиинства соперником',
                'better': 'less'
            },
            {
                'key': Stats.MISSED_SH,
                'value': values[7].find('p').contents[0],
                'name': 'Количество пропущенных в меньшинстве шайб',
                'better': 'less'
            },
            {
                'key': Stats.SH_PERCENT,
                'value': values[8].find('p').contents[0],
                'name': 'Процент нейтрализации меньшинства',
                'better': 'more'
            },
            {
                'key': Stats.SCORED_SH,
                'value': values[9].find('p').contents[0],
                'name': 'Количество заброшенных в меньшинстве шайб',
                'better': 'more'
            }
        ]

    return result
