from collections import Counter
from functools import reduce
from radar import headlines_by_source, ner_headlines, merge_first_and_last_names


def normalize_counter(c: Counter) -> Counter:
    total = sum(c.values())
    return Counter({k: v / total for k, v in c.items()})


def gauge_score(part: Counter, whole: Counter) -> Counter:
    return Counter({k: part[k] / whole[k] for k in part.keys() & whole.keys()})


def common_counter(c: Counter, n: int) -> Counter:
    # Return a counter with the n most common elements of c (rather than a dictionary).
    return Counter({k: v for k, v in c.most_common(n)})


def generate_standard(sources: list[str], start_date=None, end_date=None) -> Counter:
    c = []
    for source in sources:
        headlines = headlines_by_source(source, start_date=start_date, end_date=end_date)
        ner = ner_headlines(headlines)
        c.append(normalize_counter(ner))

    return common_counter(reduce(lambda a, b: a & b, c), 10)


def pad_counter(c: Counter, world: Counter) -> Counter:
    return Counter({k: c[k] if k in c else 0 for k in world.keys()})


def interpret_source(source: str, world: Counter, start_date=None, end_date=None) -> list[dict[str, float]]:
    headlines = headlines_by_source(source, start_date=start_date, end_date=end_date)
    ner = merge_first_and_last_names(ner_headlines(headlines))
    ner = pad_counter(ner, world)
    score = normalize_counter(gauge_score(normalize_counter(ner), world))

    return [{"name": entity, "prominence": proportion} for entity, proportion in score.items()]
