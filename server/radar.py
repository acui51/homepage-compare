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
        try:
            tokens = word_tokenize(headline)
        except TypeError:
            continue
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
    query = supabase_client.table("top-headlines-news").select("title, source_id, content").filter("source_id", "eq", source)
    if start_date is not None:
        query = query.filter("publishedAt", "gt", start_date)
    if end_date is not None:
        query = query.filter("publishedAt", "lt", end_date)
    response = query.execute()
    entries = response.data
    # print(response.data[1]["content"], "con")
    result = []
    for entry in entries:
        a = entry["title"]
        # if "content" in entry and entry["content"] is not None:
        #     a += "\n??\n" + entry["content"]
        result.append(a)

    if source == "the-wall-street-journal":
        source = "wsj"
    query = supabase_client.table("homepage-news").select("title, source_id").filter("source_id", "eq", source)
    if start_date is not None:
        query = query.filter("created_at", "gt", start_date)
    if end_date is not None:
        query = query.filter("created_at", "lt", end_date)

    response = query.execute()
    entries = response.data
    for entry in entries:
        a = entry["title"]
        result.append(a)

    # print(result, source)
    return result


def normalized_top_ten(c: Counter):
    # Normalize the counts to get the relative proportion of each entity in the Counter object.
    # Return the top ten entities, which will be used for the ten vertices of the radar chart.
    total_count = sum(c.values())
    c = {name: count / total_count for name, count in c.items()}
    top_ten = Counter(c).most_common(10)

    return top_ten


def overall_normalized_top_ten(c: list[Counter]) -> dict[str, list[tuple[str, float]]]:
    # Merge the Counter objects in the list and return the normalized top ten entities.
    out = Counter()
    for counter in c:
        out += counter

    keys = ["the-washington-post", "the-wall-street-journal", "fox-news"]
    result = {}
    for cntr in c:
        result[keys[c.index(cntr)]] = normalized_top_ten(cntr)

    return result


def most_prominent(source: dict[str, Counter]) -> dict[str, Counter]:
    # Find the entities that all the sources have in common in their Counter objects.
    # Return a dict mapping sources to a new Counter object with only the common entities.

    common_entities = set()
    common_counters = Counter()
    top_ten = Counter()
    # grab a representative sample from each source
    samples = {}
    for s, counter in source.items():
        samples[s] = counter.most_common(10)
    # find the most common entities across all sources

    for s, counter in source.items():
        if s != "the-wall-street-journal":
            common_counters.update(counter)

    for s, counter in source.items():
        if s != "the-wall-street-journal":
            top_ten.update(counter)
            common_entities.update(counter.keys())
    top_ten_keys = [k for k, v in top_ten.most_common(10)]
    print("top_ten_keys ", top_ten_keys)

    for s, counter in source.items():
        if s != "the-wall-street-journal":
            common_entities.intersection_update(counter.keys())
    print("common_counts ", common_counters.most_common(10))
    # Create a new Counter object for each source with only the common entities.
    out = {}
    for source_name, counter in source.items():
        out[source_name] = Counter()
        for key in top_ten_keys:
            out[source_name][key] = counter[key]
        # If the number of common entities is less than 10, pad the list with entities from a combined Counter object.
        combined = Counter()
        for c in source.values():
            combined.update(c)
        if len(out[source_name]) < 10:
            for entity in top_ten_keys:
                if entity not in out[source_name]:
                    out[source_name][entity] = 0

    return out


def normalize_sources(d: dict[str, Counter]) -> dict[str, dict[str, float]]:
    # Normalize the counts in each Counter object to get the relative proportion of each entity.
    # Return a dict mapping sources to a dict mapping entities to their normalized counts.
    out = {}
    counter_with_top_keys = Counter()
    for source, counter in d.items():
        counter_with_top_keys.update(counter)

    for source, counter in d.items():
        out[source] = {}
        total_count = sum(counter.values())
        for entity, count in counter.items():
            out[source][entity] = count / total_count

    return out

def prominent_ten(d: dict[str, Counter]) -> list:
    # Given an output from most_prominent, return the top ten entities that each source has in common.
    out = []
    for source, counter in d.items():
        out.append(normalized_top_ten(counter))

    return out

def entity_tuples(source: str, start_date=None, end_date=None) -> list[tuple[str, float]]:
    headlines = headlines_by_source(source, start_date=start_date, end_date=end_date)
    ner = ner_headlines(headlines)
    ner = merge_first_and_last_names(ner)
    print("normalized", normalized_top_ten(ner))
    return normalized_top_ten(ner)


if __name__ == "__main__":
    # query = supabase_client.table("top-headlines-news").select("title, source_id, content").filter("source_id", "eq", "the-washington-post")
    # print(query.execute().data[0]["content"])
    wapo_headlines = headlines_by_source("the-washington-post")
    # print(wapo_headlines)
    # # wapo_freq = classify_headlines(wapo_headlines)
    # # print(wapo_freq)
    # ner = ner_headlines(wapo_headlines, excluded_entities=["The Washington Post", "Listen0", "Comment"])

    # merge first and last names into a single entity
    # ner = merge_first_and_last_names(ner)
    # print(normalized_top_ten(ner))
    wsj_headlines = headlines_by_source("the-wall-street-journal")
    wapo_ne = ner_headlines(wapo_headlines, excluded_entities=["The Washington Post", "Listen0", "Comment"])
    print(wsj_headlines)
    wsj_ne = ner_headlines(wsj_headlines, excluded_entities=["The Wall Street Journal"])
    # wsj_ne = merge_first_and_last_names(wsj_ne)
    # merge counter objects

    fox_headlines = headlines_by_source("fox-news")
    fox_ne = ner_headlines(fox_headlines, excluded_entities=["Fox News", "Fox News CHARLESTON"])
    # fox_ne = merge_first_and_last_names(fox_ne)
    # print(normalized_top_ten(wapo_ne))
    # remove keys from wapo_ne that are not the normalized

    # wapo_ne = {k: v for k, v in wapo_ne.items() if k in [x[0] for x in normalized_top_ten(wapo_ne | wsj_ne | fox_ne)]}
    # wsj_ne = {k: v for k, v in wsj_ne.items() if k in [x[0] for x in normalized_top_ten(wapo_ne | wsj_ne | fox_ne)]}
    # fox_ne = {k: v for k, v in fox_ne.items() if k in [x[0] for x in normalized_top_ten(wapo_ne | wsj_ne | fox_ne)]}
    # print(normalized_top_ten(wapo_ne))
    # print(normalized_top_ten(wsj_ne))
    # print(normalized_top_ten(fox_ne))

    mp = most_prominent({"the-washington-post": wapo_ne, "the-wall-street-journal": wsj_ne, "fox-news": fox_ne})
    print(mp)

    # print(normalized_top_ten(fox_ne))
