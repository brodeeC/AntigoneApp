"""Integration tests for all `/AntigoneApp/api` blueprint routes."""

import json


API = "/AntigoneApp/api"


def test_health(client):
    r = client.get(f"{API}/health")
    assert r.status_code == 200
    data = r.get_json()
    assert data.get("status") == "ok"


def test_metadata(client):
    r = client.get(f"{API}/metadata")
    assert r.status_code == 200
    data = r.get_json()
    assert data["apiVersion"] == "1.1.0"
    assert data["firstPage"] == 1
    assert data["lastPage"] == 123
    assert data["linesPerPage"] == 11
    assert data["minLine"] == 1
    assert data["maxLine"] == 1353


def test_get_all_speakers(client):
    r = client.get(f"{API}/get_all_speakers")
    assert r.status_code == 200
    speakers = r.get_json()
    assert isinstance(speakers, list)
    assert set(speakers) == {"TestSpeaker", "Chorus"}


def test_lines_single(client):
    r = client.get(f"{API}/lines/5")
    assert r.status_code == 200
    body = r.get_json()
    assert isinstance(body, list) and len(body) == 1
    assert body[0]["lineNum"] == 5
    assert "Line text 5" in body[0]["line_text"]


def test_lines_range(client):
    r = client.get(f"{API}/lines/1/3")
    assert r.status_code == 200
    body = r.get_json()
    assert len(body) == 3
    assert [b["lineNum"] for b in body] == [1, 2, 3]


def test_read_page_valid(client):
    r = client.get(f"{API}/read/1")
    assert r.status_code == 200
    lines = r.get_json()
    assert len(lines) == 11
    assert lines[0]["lineNum"] == 1
    assert lines[-1]["lineNum"] == 11


def test_read_page_invalid_low(client):
    r = client.get(f"{API}/read/0")
    assert r.status_code == 400


def test_read_page_invalid_high(client):
    r = client.get(f"{API}/read/999")
    assert r.status_code == 400


def test_read_page_with_speaker_filters_lines(client):
    r = client.get(f"{API}/read/1", query_string={"speaker": "Chorus"})
    assert r.status_code == 200
    lines = r.get_json()
    assert len(lines) == 6
    assert {x["lineNum"] for x in lines} == {1, 3, 5, 7, 9, 11}
    assert all(x["speaker"] == "Chorus" for x in lines)


def test_read_page_speaker_no_match_empty(client):
    r = client.get(f"{API}/read/1", query_string={"speaker": "NonexistentSpeaker"})
    assert r.status_code == 200
    assert r.get_json() == []


def test_read_page_speaker_case_insensitive(client):
    r = client.get(f"{API}/read/1", query_string={"speaker": "chorus"})
    assert r.status_code == 200
    assert len(r.get_json()) == 6


def test_lines_range_with_speaker(client):
    r = client.get(f"{API}/lines/1/11", query_string={"speaker": "TestSpeaker"})
    assert r.status_code == 200
    body = r.get_json()
    assert [b["lineNum"] for b in body] == [2, 4, 6, 8, 10]


def test_lines_single_speaker_mismatch_empty(client):
    r = client.get(f"{API}/lines/1", query_string={"speaker": "TestSpeaker"})
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_word_with_speaker(client):
    r = client.get(
        f"{API}/search",
        query_string={"mode": "word", "q": "πολις", "speaker": "TestSpeaker"},
    )
    assert r.status_code == 200
    data = r.get_json()
    assert len(data) >= 1
    assert all(e[0]["speaker"] == "TestSpeaker" for e in data if e and e[0])


def test_search_word_speaker_excludes_other_voice(client):
    r = client.get(
        f"{API}/search",
        query_string={"mode": "word", "q": "πολις", "speaker": "Chorus"},
    )
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_definition_with_speaker(client):
    r = client.get(
        f"{API}/search",
        query_string={
            "mode": "definition",
            "q": "unique_exact_def_match",
            "speaker": "TestSpeaker",
        },
    )
    assert r.status_code == 200
    data = r.get_json()
    assert len(data) >= 1
    assert all(e[0]["speaker"] == "TestSpeaker" for e in data if e and e[0])


def test_search_missing_params(client):
    r = client.get(f"{API}/search")
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_invalid_mode(client):
    r = client.get(f"{API}/search", query_string={"mode": "invalid", "q": "x"})
    assert r.status_code == 200
    assert r.get_json() == []


def test_search_word_mode_returns_array(client):
    r = client.get(f"{API}/search", query_string={"mode": "word", "q": "πολις"})
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list)
    assert len(data) >= 1
    first = data[0]
    assert isinstance(first, list)
    meta = first[0]
    assert meta.get("lemma") == "πολις"


def test_search_word_short_query_exact_before_substring(client):
    """Tier 1 (form_eng == 'o') must appear before tier-3 substring matches for q=o."""
    r = client.get(f"{API}/search", query_string={"mode": "word", "q": "o"})
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list)
    line_numbers = [entry[0]["line_number"] for entry in data if entry and entry[0]]
    assert 10 in line_numbers
    assert line_numbers.index(10) < line_numbers.index(20)


def test_search_definition_exact(client):
    r = client.get(
        f"{API}/search",
        query_string={"mode": "definition", "q": "unique_exact_def_match"},
    )
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list)
    lemmas = {entry[0]["lemma"] for entry in data if entry and entry[0]}
    assert "πολις" in lemmas


def test_word_details(client):
    r = client.get(f"{API}/word-details/πολις")
    assert r.status_code == 200
    data = r.get_json()
    assert isinstance(data, list)


def test_word_details_empty_unknown(client):
    r = client.get(f"{API}/word-details/zzzznotthere")
    assert r.status_code == 200
    data = r.get_json()
    assert data == []
