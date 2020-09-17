"""
    :author: Jinfen Li
    :url: https: // github.com / LiJinfen
"""
import os
import sys

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

# SQLite URI compatible
WIN = sys.platform.startswith('win')
if WIN:
    prefix = 'sqlite:///'
else:
    prefix = 'sqlite:////'


class BaseConfig:
    MESSAGE_PER_PAGE = 30
    ADMIN = os.getenv('ADMIN', 'user201')

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev key')

    # SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', prefix + os.path.join(basedir, 'data.db'))

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', "postgres://brwmbggqcbsauw:df9a7d2a1d3ef852b1f9aafacd1d6a152b3148430b1abb8c65d2a7b0372c3ed1@ec2-54-224-124-241.compute-1.amazonaws.com:5432/d3q2l4sskqrbmb")

    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(BaseConfig):
    pass


class ProductionConfig(BaseConfig):
    # SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    pass


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///'
    WTF_CSRF_ENABLED = False


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}
