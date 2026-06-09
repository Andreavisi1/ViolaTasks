"""Dashboard Viola Analytics. Si lancia con:  streamlit run app.py

Incorpora la dashboard di design (cartella design/) e la alimenta con i NOSTRI dati:
il CSV viene generato al volo da DuckDB sui Parquet puliti, quindi resta una sola
fonte di verità (il magazzino). Flusso: scarica il CSV → trascinalo nella dashboard.
"""
import streamlit as st

from src import queries

st.set_page_config(page_title="Viola Analytics", page_icon="⚜", layout="wide")
# Servita da static/ come pagina vera (enableStaticServing): il file è autosufficiente
# (librerie + JSX pre-compilato + crest), quindi boota come quando lo apri da solo.
DESIGN_URL = "/app/static/Viola-Analytics-Dashboard.html"


@st.cache_resource
def get_con():
    """Una sola connessione DuckDB, riusata tra i refresh (cache_resource)."""
    return queries.connect()


con = get_con()

st.title("⚜ Viola Analytics")
st.caption("Dashboard di design, alimentata dai nostri dati puliti (JSON → Parquet → DuckDB)")

st.markdown(
    "**Come si usa:** "
    "**1)** scarica qui sotto il CSV dei nostri dati (generato dai JSON puliti dalla pipeline). "
    "**2)** trascinalo nella dashboard qui sotto, nell'area di caricamento."
)

csv = queries.events_flat_df(con).to_csv(index=False).encode("utf-8")
st.download_button("⬇  Scarica il CSV dei dati", csv, "events_flat.csv", "text/csv")

st.divider()

st.iframe(DESIGN_URL, height=1000)

st.divider()
st.caption("© 2026 Andrea Visi · Viola Analytics")
