from lxml import etree
from treebank_parse import strip_accents, grk_to_eng
import csv

# Define XML namespaces
ns = {
    "cts": "http://chs.harvard.edu/xmlns/cts",
    "tei": "http://www.tei-c.org/ns/1.0"
}

# Parse the XML file
tree = etree.parse("database/raw_data/full_text.xml")

# Find all lines of dialogue
lines = tree.xpath("//tei:l", namespaces=ns)
speakers = tree.xpath("//tei:speaker", namespaces=ns)

# Prepare CSV output
csv_filename = "database/csv/lines.csv"
with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["line_number", "line_text", "speaker", "norm_speaker", "eng_speaker"])  # Header row

    current_speaker = None
    norm_speaker = None
    eng_speaker = None
    speaker_idx = 0  # Track speaker elements

    for line in lines:
        line_number = line.get("n")
        line_text = line.text.strip() if line.text else ""

        # Check if there's a speaker change
        speaker_element = line.getprevious()
        if speaker_element is not None and speaker_element.tag.endswith("speaker"):
            current_speaker = speaker_element.text.strip()
            norm_speaker = strip_accents(current_speaker)
            eng_speaker = grk_to_eng(norm_speaker)

        writer.writerow([line_number, line_text, current_speaker, norm_speaker, eng_speaker])

print(f"CSV file '{csv_filename}' successfully created!")
