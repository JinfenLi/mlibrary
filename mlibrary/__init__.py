# -*- coding: utf-8 -*-
"""
    :author: Jinfen Li
    :url: https: // github.com / LiJinfen
"""
import os

import click
from flask import Flask, render_template
from flask_wtf.csrf import CSRFError


from mlibrary.blueprints.auth import auth_bp
from mlibrary.blueprints.song import song_bp
from mlibrary.extensions import db, login_manager, csrf, moment,migrate
from mlibrary.models import User
from mlibrary.settings import config


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'production')

    app = Flask('mlibrary')
    app.config.from_object(config[config_name])

    register_extensions(app)
    register_blueprints(app)
    register_errors(app)
    register_commands(app)

    return app


def register_extensions(app):
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    moment.init_app(app)
    migrate.init_app(app,db)




def register_blueprints(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(song_bp)



def register_errors(app):
    @app.errorhandler(400)
    def bad_request(e):
        return render_template('error.html', description=e.description, code=e.code), 400

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('error.html', description=e.description, code=e.code), 404

    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('error.html', description='Internal Server Error', code='500'), 500

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return render_template('error.html', description=e.description, code=e.code), 400


def register_commands(app):
    @app.cli.command()
    @click.option('--drop', is_flag=True, help='Create after drop.')
    def initdb(drop):
        """Initialize the database."""
        if drop:

            click.confirm('This operation will delete the database, do you want to continue?', abort=True)
            db.drop_all()
            click.echo('Drop tables.')
        db.create_all()
        click.echo('Initialized database.')



    @app.cli.command()
    @click.option('--message', default=300, help='Quantity of messages, default is 300.')
    def forge(message):
        """Generate fake data."""
        from sqlalchemy.exc import IntegrityError

        click.echo('Initializing the database...')
        db.drop_all()
        db.create_all()

        click.echo('Forging the data...')
        # admin = User(nickname='user100', email='user100@qq.com')
        # admin.set_password('12345')
        # db.session.add(admin)
        # db.session.commit()

        click.echo('Generating users...')
        users = []
        for i in range(1, 7):
            user = User(nickname='user' + str(i),
                        bio='',
                        github='',
                        website='',
                        email='user' + str(i+1)+'@qq.com'
                        )
            if i==201:
                user.set_password('admin')
            else:
                user.set_password('12345')
            db.session.add(user)
            users.append(user)
            try:
                db.session.commit()
            except IntegrityError:
                db.session.rollback()
        user = User(nickname='user' + str(201),
                    bio='',
                    github='',
                    website='',
                    email='user' + str(201) + '@qq.com'
                    )

        user.set_password('admin')
        db.session.add(user)
        db.session.commit()





        click.echo('Done.')

