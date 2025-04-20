import pytest
from app import create_app
from app.models import db, FullText

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        # Add test data
        test_line = FullText(line_number=1, line_text="Test line", speaker="Test Speaker")
        db.session.add(test_line)
        db.session.commit()
        
        yield app
        db.drop_all()

def test_get_line(client):
    response = client.get('/AntigoneApp/lines/1')
    assert response.status_code == 200
    assert b"Test line" in response.data