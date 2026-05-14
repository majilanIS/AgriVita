"""Add phone and profile columns

Revision ID: a1b2c3d4e5f6
Revises: 77b5f53f49be
Create Date: 2026-05-14 20:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '77b5f53f49be'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('phone_number', sa.String(), nullable=False))
    op.add_column('users', sa.Column('full_name', sa.String(), nullable=True))
    op.add_column('users', sa.Column('national_id', sa.String(), nullable=True))
    op.add_column('users', sa.Column('country', sa.String(), nullable=True))
    op.add_column('users', sa.Column('preferred_language', sa.String(), nullable=True, server_default=sa.text("'English'")))
    op.add_column('users', sa.Column('farm_location', sa.String(), nullable=True))
    op.add_column('users', sa.Column('field_size', sa.Float(), nullable=True))
    op.add_column('users', sa.Column('planting_date', sa.String(), nullable=True))
    op.add_column('users', sa.Column('main_crops', sa.JSON(), nullable=True))
    op.add_column('users', sa.Column('avatar_url', sa.String(), nullable=True))
    op.add_column('users', sa.Column('farm_image_url', sa.String(), nullable=True))
    op.add_column('users', sa.Column('id_document_url', sa.String(), nullable=True))
    op.create_index(op.f('ix_users_phone_number'), 'users', ['phone_number'], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_users_phone_number'), table_name='users')
    op.drop_column('users', 'id_document_url')
    op.drop_column('users', 'farm_image_url')
    op.drop_column('users', 'avatar_url')
    op.drop_column('users', 'main_crops')
    op.drop_column('users', 'planting_date')
    op.drop_column('users', 'field_size')
    op.drop_column('users', 'farm_location')
    op.drop_column('users', 'preferred_language')
    op.drop_column('users', 'country')
    op.drop_column('users', 'national_id')
    op.drop_column('users', 'full_name')
    op.drop_column('users', 'phone_number')
