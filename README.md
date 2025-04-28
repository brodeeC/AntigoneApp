# Antigone Reader
#### Coming soon to Android and the Web

## Released April 2025 on iPhone and iPadOS:
[Get Antigone Reader](https://apps.apple.com/app/id6745100412)

## Data

This project uses and extends classical texts with modern computational analysis. All data is openly licensed with clear attribution requirements.

### Sources

- **Greek Text**:  
  Line-by-line text of Sophocles' *Antigone* from the [Scaife Viewer](https://scaife.perseus.org/) ([CC-BY](https://creativecommons.org/licenses/by/4.0/)).
- **Morphological Analysis**:  
  Parsed annotations from the [Perseus Ancient Greek Dependency Treebank](https://perseusdl.github.io/treebank_data/) (v2.1, [CC-BY](https://creativecommons.org/licenses/by/4.0/)).
- **Definitions**:  
  Lexical data from the [Perseus Digital Library](http://www.perseus.tufts.edu) ([CC-BY](https://creativecommons.org/licenses/by/4.0/)).

### Derived Datasets

Processed CSV files available in `/backend/database/csv/`:

| File | Contents |
|------|----------|
| `lines.csv` | Standardized text with speaker metadata |
| `wordList.csv` | Lemmatized tokens with morphological tags |
| `defList.csv` | Cross-referenced dictionary entries |

### Licensing

- **Source Data**: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/) (Perseus/Scaife)
- **Processed Data**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
  - *Attribution Requirement*: [Attribution](backend/database/csv/ATTRIBUTION.md)
- **Application Code**: [MIT License](backend/database/csv/LICENSE.md)

### How to Cite

For academic use, please cite both:

1. Original sources (see [detailed attribution](/backend/database/csv/ATTRIBUTION.md))
