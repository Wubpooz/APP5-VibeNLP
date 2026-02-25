# VibeNLP

An NLP (Natural Language Processing) course covering the full journey from classical word embeddings to modern large language models, with hands-on exercises and group presentations.

**Course Website**: [https://zzcoolj.github.io/VibeNLP/](https://zzcoolj.github.io/VibeNLP/)

## Course Overview

- **Instructor**: ZHANG Zheng
- **Schedule**: February - March 2026
- **Languages**: Trilingual support (English / Chinese / French)

## Topics

| Day | Session 1 | Session 2 |
|-----|-----------|-----------|
| Day 1 | NLP Fundamentals | Word Embeddings (Word2Vec, GloVe) |
| Day 2 | Attention Mechanisms | Transformer Architecture |
| Day 3 | Pre-training (MLM/CLM, Scaling Laws) | Fine-tuning (LoRA, Adapter, PEFT) |
| Day 4 | Prompting (CoT, ICL, Few-shot) | RAG (Retrieval-Augmented Generation) |
| Day 5 | Document AI & Multimodal | RLHF & Alignment |
| Day 6 | Demo Day - Project Presentations | |

## Repository Structure

```
├── en/              # English website pages
├── cn/              # Chinese website pages
├── fr/              # French website pages
├── slides/          # Lecture slide decks (HTML)
├── exercises/       # Hands-on exercises (trilingual)
├── _layouts/        # Jekyll layout templates
└── _config.yml      # Jekyll site configuration
```

## Grading

1. **NLP Project Presentation** (Demo Day) - March 31, 2026
2. **Group Knowledge Sharing Presentations** - March 9-20, 2026

## Local Development

This site is built with [Jekyll](https://jekyllrb.com/). To run locally:

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000/VibeNLP/`.
