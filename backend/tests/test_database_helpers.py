"""Direct tests for database_helpers (requires app + DB context)."""

from app.database_helpers import get_word, lookup_word_details


def test_lookup_word_details_whitespace_only_returns_empty(app):
    with app.app_context():
        assert lookup_word_details("   ") == []
        assert lookup_word_details("") == []


def test_get_word_first_form_by_lemma_id(app):
    with app.app_context():
        form = get_word(300)
        assert form == "πολις"

