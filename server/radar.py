import nltk
from collections import Counter
from nltk.tokenize import word_tokenize
from supabase import create_client, Client
from utils import load_credentials

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

supabase_url, supabase_key = load_credentials()
supabase_client = create_client(supabase_url, supabase_key)


def ner_headlines(headlines: list[str], excluded_entities=None) -> Counter:
    # Identify the named entities in each headline and return Counter object containing the frequency of each entity.
    if excluded_entities is None:
        excluded_entities = []
    out = Counter()  # Might be simpler to just use a dict, but Counter also has some useful methods (used below).
    for headline in headlines:
        tokens = word_tokenize(headline)
        tagged = nltk.pos_tag(tokens)
        entities = nltk.chunk.ne_chunk(tagged)
        for entity in entities:
            if hasattr(entity, "label") and entity.label() == "PERSON":
                name = " ".join(c[0] for c in entity.leaves())
                if name not in excluded_entities:
                    out[name] += 1

    return out


def merge_first_and_last_names(c: Counter) -> Counter:
    # If the first and last names of an entity appear separately in the Counter object, merge them into a single entry.
    names = [name for name in c.keys() if " " in name]
    for name in names:
        try:
            first, last = name.split(" ")
            if first in c or last in c:
                c[first + " " + last] += c[first] + c[last]
                del c[first]
                del c[last]
        except ValueError:
            continue

    return c


def headlines_by_source(source: str, start_date=None, end_date=None) -> list[str]:
    query = supabase_client.table("top-headlines-news").select("title, source_id").filter("source_id", "eq", source)
    if start_date is not None:
        query = query.filter("publishedAt", "gt", start_date)
    if end_date is not None:
        query = query.filter("publishedAt", "lt", end_date)
    response = query.execute()
    entries = response.data

    return [entry["title"] for entry in entries]


def normalized_top_ten(c: Counter) -> list[tuple[str, float]]:
    # Normalize the counts to get the relative proportion of each entity in the Counter object.
    # Return the top ten entities, which will be used for the ten vertices of the radar chart.
    total_count = sum(c.values())
    c = {name: count / total_count for name, count in c.items()}
    top_ten = Counter(c).most_common(10)

    return top_ten


def entity_tuples(source: str, start_date=None, end_date=None) -> list[tuple[str, float]]:
    headlines = headlines_by_source(source, start_date=start_date, end_date=end_date)
    ner = ner_headlines(headlines, excluded_entities=[" ".join(source.split("-")).title()])
    ner = merge_first_and_last_names(ner)
    return normalized_top_ten(ner)


if __name__ == "__main__":
    wapo_headlines = headlines_by_source("the-washington-post")
    print(wapo_headlines)
    # wapo_freq = classify_headlines(wapo_headlines)
    # print(wapo_freq)
    ner = ner_headlines(wapo_headlines, excluded_entities=["The Washington Post"])

    # merge first and last names into a single entity
    ner = merge_first_and_last_names(ner)
    print(normalized_top_ten(ner))
    wsj_headlines = headlines_by_source("the-wall-street-journal")
    print(wsj_headlines)
    wsj_ne = ner_headlines(wsj_headlines, excluded_entities=["The Wall Street Journal"])
    wsj_ne = merge_first_and_last_names(wsj_ne)
    print(normalized_top_ten(wsj_ne))

    fox_headlines = headlines_by_source("fox-news")
    fox_ne = ner_headlines(fox_headlines, excluded_entities=["Fox News"])
    fox_ne = merge_first_and_last_names(fox_ne)
    print(normalized_top_ten(fox_ne))
