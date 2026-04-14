"""Unit tests for standalone helpers in app.utils."""

from app.utils import parse_postag, strip_accents, clean_word


def test_parse_postag_valid_nine_characters():
    out = parse_postag("n-s---n--")
    assert out.get(1) == "noun"
    assert out.get(3) == "singular"


def test_parse_postag_short_or_empty_returns_empty_dict():
    assert parse_postag("") == {}
    assert parse_postag("short") == {}
    assert parse_postag("n-s---n-") == {}


def test_strip_accents_and_clean_word_basic():
    assert strip_accents("hello") == "hello"
    assert clean_word("[word.]") == "word"

