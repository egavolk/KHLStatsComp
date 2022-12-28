FROM python:3.10.9-alpine

ENV PYTHONUNBUFFERED 1
COPY ./requirements.txt /requirements.txt

RUN pip install -r /requirements.txt

RUN mkdir /backend
COPY ./ /backend
WORKDIR /backend