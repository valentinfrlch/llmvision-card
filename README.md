<p align="center">
<img src="https://github.com/user-attachments/assets/bebd92b8-765e-4d63-bb3d-47e1bb8b51ad" width=500px>
</p>
<h1 align=center>Dashboard Card</h1>
<p align=center>
<img src=https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badg>
<img src=https://img.shields.io/badge/version-beta-blue>
<a href="https://github.com/valentinfrlch/llmvision-card/issues">
<img src="https://img.shields.io/maintenance/yes/2025.svg">
<img alt="Issues" src="https://img.shields.io/github/issues/valentinfrlch/llmvision-card?color=0088ff"/>
    </a>
    <p align=center style="font-weight:bold">
      Home Assistant Card to display LLM Vision's Event Calendar
    </p>
</p>

  <p align="center">
    <a href="#prerequisites">🌟 Prerequisites </a>
    ·
    <a href="#installation">⬇️ Installation</a>
    ·
    <a href="#setup">🚧 Setup</a>
    ·
    <a href="#configuration">☕ Configuration</a>    
  </p>
<p align="center">
  <a href="https://llmvision.org"> Visit Website →</a>
    </p>

<img src="https://github.com/user-attachments/assets/97f6e608-bdf3-44d1-89f1-fd89cda7b764" data-canonical-src="https://gyazo.com/eb5c5741b6a9a16c692170a41a49c858.png" width="50%" height="auto" />

## Prerequisites
1. LLM Vision and at least one AI provider set up
2. Timeline provider set up in LLM Vision
3. Blueprint or Automation to update the calendar entity

## Documentation
<a href="https://llm-vision.gitbook.io/getting-started/setup/timeline-card-beta"><img src="https://img.shields.io/badge/Documentation-blue?style=for-the-badge&logo=gitbook&logoColor=white&color=18bcf2"/> </a>

## Installation
Add the repository to HACS and install the LLM Vision card using this link:
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=valentinfrlch&repository=llmvision-card&category=Dashboard)

Alternatively you can add the url of this repository to the custom respositories list in HACS.

## Setup
1. Install the card through HACS
2. Reload Home Assistant page
3. Add the card to your dashboard

## Configuration

| Parameter         | Description                                                                              | Default                      |
|-------------------|------------------------------------------------------------------------------------------|------------------------------|
| number_of_events  | How many events to show                                                                  | 5                            |
| calendar_entity   | LLM Vision Timeline Entity (needs to be set up in LLM Vision Settings first)             | calendar.llm_vision_timeline |
| refresh_interval  | Refresh Interval (in minutes)                                                            | 1                            |
| lang              | Language used to generate icons                                                          | en                           |
