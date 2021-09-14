#!/usr/bin/python

from argparse import ArgumentParser, ArgumentTypeError, Namespace
import os.path
import requests
import socket
import json
import io
import sys
from qrcode import QRCode

API_URL = 'http://localhost:8000'
APP_NAME = 'notif'
TOKEN_PATH = os.path.join(os.path.dirname(__file__), 'storage/token.txt')

def main(argv=None) -> None:
  parser = ArgumentParser(prog=APP_NAME)

  # Flags
  parser.add_argument('-V', '--version', help='Version', action='version', version=getVersion())
  # parser.add_argument('-v', '--verbose', help='Verbose', action='store_true')

  # Positional args
  parser.add_argument('action', help='...', type=str, choices=['link', 'ping', 'unlink'], nargs='?', default='ping')

  # Invoke arg parser
  args = parser.parse_args(argv)
  action = args.action

  # Load token
  token = None

  if (os.path.exists(TOKEN_PATH)):
    with open(TOKEN_PATH, 'r') as file:
      token = file.read()

  # Action
  if action == 'link':
    link(token)
  elif action == 'ping':
    ping(token)
  elif action == 'unlink':
    unlink(token)
  else:
    exit(f'fatal: unsupported action {action}')

  exit(0) 


def link(token: str, device: str = None) -> None:
  if token:
    unlink(token)

  response = requests.get(f'{API_URL}/token')
  
  token = json.loads(response.text)['token']

  if not (device):
    device = socket.gethostname() 

  with open(TOKEN_PATH, 'w') as file:
    file.write(token)

  payload = {
    'name': device,
    'token': token,
  }

  qr = QRCode()
  qr.add_data(json.dumps(payload)) 
  qr.print_ascii(out=sys.stdout)

  # while True:
  #   input()


def ping(token: str, message: str = None) -> None:
  if not(token):
    exit('please link first')

  payload = { 
    'token': token,
    'message': message,
  }

  response = requests.post(f'{API_URL}/ping', json=payload)
  if not(response.ok):
    exit(response)


def unlink(token: str) -> None:
  if not(token):
    exit('not bound')

  payload = { 'token': token }

  response = requests.post(f'{API_URL}/unlink', json=payload)
  if not(response.ok):
    exit(response)

  if (os.path.exists(TOKEN_PATH)):
    os.remove(TOKEN_PATH)


def getVersion() -> str:
  return '0.0.0'


if __name__ == '__main__':
  main()
  