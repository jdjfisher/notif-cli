#!/usr/bin/python

from argparse import ArgumentParser, ArgumentTypeError, Namespace
import os.path
import requests
import socket
import json

API_URL = 'http://localhost:8000'
APP_NAME = 'notif'
TOKEN_PATH = os.path.join(os.path.dirname(__file__), 'storage/token.txt')

def main(argv=None) -> None:
  parser = ArgumentParser(prog=APP_NAME)

  # Flags
  parser.add_argument('-V', '--version', help='Version', action='version', version=getVersion())
  # parser.add_argument('-v', '--verbose', help='Verbose', action='store_true')

  # Positional args
  parser.add_argument('action', help='...', type=str, choices=['bind', 'ping', 'unbind'])

  # Invoke arg parser
  args = parser.parse_args(argv)
  action = args.action

  # Load token
  token = None

  if (os.path.exists(TOKEN_PATH)):
    with open(TOKEN_PATH, 'r') as file:
      token = file.read()

  # Action
  if action == 'bind':
    bind(token)
  elif action == 'ping':
    ping(token)
  elif action == 'unbind':
    unbind(token)
  else:
    exit('fatal')

  exit(0) 


def bind(token: str) -> None:
  if token:
    unbind(token)

  response = requests.get(f'{API_URL}/token')
  
  token = json.loads(response.text)['token']

  device = socket.gethostname() # TODO: Make this an optional flag and validate

  with open(TOKEN_PATH, 'w') as file:
    file.write(token)

  # url = f'{APP_NAME}://bind?device={device}&token={token}'

  print(f'device: {device}, token: {token}')
  print('TODO: generate and display a QR for the app')


def ping(token: str) -> None:
  if not(token):
    exit('please bind first')

  payload = { 'token': token }

  response = requests.post(f'{API_URL}/ping', json=payload)
  if not(response.ok):
    exit(response)


def unbind(token: str) -> None:
  if not(token):
    exit('not bound')

  payload = { 'token': token }

  response = requests.post(f'{API_URL}/unbind', json=payload)
  if not(response.ok):
    exit(response)

  if (os.path.exists(TOKEN_PATH)):
    os.remove(TOKEN_PATH)


def getVersion() -> str:
  return '0.0.0'


if __name__ == '__main__':
  main()
  