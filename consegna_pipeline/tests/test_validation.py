"""Test del layer di validazione: rifiuta i malformati, segnala le incongruenze soft."""
import pytest

from src import validation


def _match(**override):
    """Una partita minima e valida; gli override permettono di romperla a piacere."""
    m = {
        "match_id": 1, "competition": "Serie A", "season": "2024-2025",
        "match_date": "2024-01-01",
        "home_team": {"team_id": 1, "name": "A"}, "away_team": {"team_id": 2, "name": "B"},
        "score": {"home": 1, "away": 0},
        "players": [{"player_id": 1, "name": "N", "team_id": 1, "position": "FW", "minutes": 90}],
        "events": [{"event_id": 1, "minute": 10, "second": 0, "team_id": 1, "player_id": 1,
                    "x": 50.0, "y": 50.0, "type": "shot", "outcome": "goal", "xg": 0.5}],
    }
    m.update(override)
    return m


def test_partita_valida_nessun_avviso():
    assert validation.validate_match(_match()) == []


def test_campo_obbligatorio_mancante():
    m = _match()
    del m["score"]
    with pytest.raises(validation.ValidationError):
        validation.validate_match(m)


def test_tipo_evento_sconosciuto_rifiutato():
    e = {"event_id": 1, "minute": 1, "second": 0, "team_id": 1, "player_id": 1,
         "x": 10.0, "y": 10.0, "type": "banana", "outcome": "x"}
    with pytest.raises(validation.ValidationError):
        validation.validate_match(_match(events=[e]))


def test_outcome_non_ammesso_rifiutato():
    e = {"event_id": 1, "minute": 1, "second": 0, "team_id": 1, "player_id": 1,
         "x": 10.0, "y": 10.0, "type": "tackle", "outcome": "goal"}  # 'goal' non e' valido per tackle
    with pytest.raises(validation.ValidationError):
        validation.validate_match(_match(events=[e]))


def test_coordinate_fuori_campo_rifiutate():
    e = {"event_id": 1, "minute": 1, "second": 0, "team_id": 1, "player_id": 1,
         "x": 150.0, "y": 10.0, "type": "pass", "outcome": "complete"}
    with pytest.raises(validation.ValidationError):
        validation.validate_match(_match(events=[e]))


def test_ruolo_non_valido_rifiutato():
    with pytest.raises(validation.ValidationError):
        validation.validate_match(_match(
            players=[{"player_id": 1, "name": "N", "team_id": 1, "position": "ZZ", "minutes": 90}]))


def test_gol_non_coerenti_col_punteggio_sono_avviso():
    # 1 gol negli eventi ma 3 nel punteggio -> avviso soft, non eccezione
    warns = validation.validate_match(_match(score={"home": 3, "away": 0}))
    assert len(warns) == 1
