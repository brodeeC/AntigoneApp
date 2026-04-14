"""Pytest fixtures: in-memory SQLite, rate limits off, seeded API data."""

import pytest

from app import create_app
from app import db
from app.models import FullText, LemmaData, LemmaDefinition


@pytest.fixture
def app():
    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "SQLALCHEMY_TRACK_MODIFICATIONS": False,
        "CORS_ORIGINS": ["https://brodeeclontz.com"],
        "RATELIMIT_ENABLED": False,
        "SECRET_KEY": "test-secret",
    }
    application = create_app(test_config=test_config)
    with application.app_context():
        db.create_all()
        _seed_database()
        db.session.commit()
    yield application
    with application.app_context():
        db.session.remove()
        db.drop_all()
        db.engine.dispose(close=True)


@pytest.fixture
def client(app):
    return app.test_client()


def _seed_database():
    """Minimal rows to exercise all /AntigoneApp/api routes."""
    # Reading: page 1 = lines 1..11, page 2 = 12..22, and lemmas can reference lines up to 40
    for n in range(1, 45):
        db.session.add(
            FullText(
                line_number=n,
                line_text=f"Line text {n}",
                speaker="TestSpeaker" if n % 2 == 0 else "Chorus",
            )
        )

    # Short-query search ranking: exact form_eng 'o' before substring-only match
    db.session.add(
        LemmaData(
            lemma_id=100,
            line_number=10,
            lemma="ο",
            form="ο",
            postag="n-s---n--",
            normalized="ο",
            norm_form="ο",
            full_eng="",
            eng_lemma="o",
            form_eng="o",
            norm_form_eng="o",
            urn="",
        )
    )
    db.session.add(
        LemmaData(
            lemma_id=200,
            line_number=20,
            lemma="βββ",
            form="βββ",
            postag="n-s---n--",
            normalized="βββ",
            norm_form="βββ",
            full_eng="",
            eng_lemma="bbb",
            form_eng="wordwithxoinside",
            norm_form_eng="wordwithxoinside",
            urn="",
        )
    )
    # Longer query + definition mode
    db.session.add(
        LemmaData(
            lemma_id=300,
            line_number=30,
            lemma="πολις",
            form="πολις",
            postag="n-s---n--",
            normalized="πολις",
            norm_form="πολις",
            full_eng="city",
            eng_lemma="polis",
            form_eng="polis",
            norm_form_eng="polis",
            urn="",
        )
    )
    db.session.add(
        LemmaDefinition(
            lemma_id=300,
            def_num=1,
            short_definition="unique_exact_def_match",
            queries="",
        )
    )
    db.session.add(
        LemmaDefinition(
            lemma_id=300,
            def_num=2,
            short_definition="something unique_exact_def_match suffix",
            queries="",
        )
    )
    # Definition search: partial (contains) path only — no exact duplicate string
    db.session.add(
        LemmaDefinition(
            lemma_id=200,
            def_num=1,
            short_definition="ZZZ_EDGE_PARTIAL_SUBSTRING_MARKER_ZZZ",
            queries="",
        )
    )
    # Two-character short-query tier (len(normalized)==2)
    db.session.add(
        LemmaData(
            lemma_id=400,
            line_number=40,
            lemma="aa",
            form="aa",
            postag="n-s---n--",
            normalized="aa",
            norm_form="aa",
            full_eng="",
            eng_lemma="aa",
            form_eng="aa",
            norm_form_eng="aa",
            urn="",
        )
    )
