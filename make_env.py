from secrets import choice
from string import ascii_letters as letters, digits
from json import dumps


ALPHABET = letters + digits
password = ''.join(choice(ALPHABET) for i in range(40))
ENV_INFO = {
    'POSTGRES_HOST': 'localhost',
    'POSTGRES_PORT': 5432,
    'POSTGRES_USER': 'secret',
    'POSTGRES_PASSWORD': password,
    'POSTGRES_DB': 'secret',
    'POSTGRES_MIGRATIONS': 'migrations',
}
JSON_INFO = {
    'host': 'localhost',
    'port': 5432,
    'user': 'secret',
    'password': password,
    'database': 'secret',
    'migrations': 'migrations',
}


def show_as_env(info):
    return '\n'.join(f'{key}={value}' for key, value in info.items())


def save_to_json(info):
    with open('env.json', 'w') as json:
        json.write(dumps(info, indent=4))


def save_to_env(info):
    with open('.env', 'w') as env:
        env.write(show_as_env(info))


if __name__ == '__main__':
    save_to_env(ENV_INFO)
    save_to_json(JSON_INFO)
