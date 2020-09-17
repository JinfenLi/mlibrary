"""empty message

Revision ID: 0840e3005d6d
Revises: 
Create Date: 2020-09-16 20:38:34.031519

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0840e3005d6d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('ix_message_timestamp', table_name='message')
    op.drop_table('message')
    op.drop_index('ix_revised_message_timestamp', table_name='revised_message')
    op.drop_table('revised_message')
    op.drop_table('user_has_song')
    op.drop_table('user_has_room')
    op.drop_index('ix_room_timestamp', table_name='room')
    op.drop_table('room')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('room',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('name', sa.TEXT(), nullable=False),
    sa.Column('description', sa.TEXT(), nullable=True),
    sa.Column('timestamp', sa.DATETIME(), nullable=True),
    sa.Column('owner', sa.TEXT(), nullable=True),
    sa.Column('first_owner_id', sa.INTEGER(), nullable=True),
    sa.Column('second_owner_id', sa.INTEGER(), nullable=True),
    sa.Column('room_type', sa.INTEGER(), nullable=False),
    sa.Column('isShow', sa.INTEGER(), nullable=False),
    sa.Column('closed', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['first_owner_id'], ['user.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['second_owner_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_room_timestamp', 'room', ['timestamp'], unique=False)
    op.create_table('user_has_room',
    sa.Column('user_id', sa.INTEGER(), nullable=False),
    sa.Column('room_id', sa.INTEGER(), nullable=False),
    sa.Column('quit_time', sa.DATETIME(), nullable=True),
    sa.Column('status', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['room_id'], ['room.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'room_id')
    )
    op.create_table('user_has_song',
    sa.Column('user_id', sa.INTEGER(), nullable=False),
    sa.Column('song_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['song_id'], ['song.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'song_id')
    )
    op.create_table('revised_message',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('body', sa.TEXT(), nullable=False),
    sa.Column('timestamp', sa.DATETIME(), nullable=True),
    sa.Column('sender_id', sa.INTEGER(), nullable=True),
    sa.Column('message_id', sa.INTEGER(), nullable=True),
    sa.Column('room_id', sa.INTEGER(), nullable=True),
    sa.Column('lock', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['message_id'], ['message.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['room_id'], ['room.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['sender_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_revised_message_timestamp', 'revised_message', ['timestamp'], unique=False)
    op.create_table('message',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('body', sa.TEXT(), nullable=False),
    sa.Column('timestamp', sa.DATETIME(), nullable=True),
    sa.Column('sender_id', sa.INTEGER(), nullable=True),
    sa.Column('room_id', sa.INTEGER(), nullable=True),
    sa.Column('persuasive', sa.INTEGER(), nullable=True),
    sa.Column('stance', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['room_id'], ['room.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['sender_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_message_timestamp', 'message', ['timestamp'], unique=False)
    # ### end Alembic commands ###