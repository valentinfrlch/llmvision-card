<p align="center">
<img src="https://github.com/user-attachments/assets/bebd92b8-765e-4d63-bb3d-47e1bb8b51ad" width=500px>
</p>
<h1 align=center>Dashboard Card</h1>
<p align=center>
<img src=https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badg>
<img src=https://img.shields.io/badge/version-alpha-blue>
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


## Prerequisites
1. LLM Vision and at least one AI provider set up
2. Event Calendar enabled in LLM Vision
3. Blueprint or Automation to update the calendar entity

## Installation
[![Open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=valentinfrlch&repository=llmvision-card&category=Dashboard)


## Setup
1. Install the card through HACS
2. Reload Home Assistant page
3. Add the card to your dashboard

## Configuration

| Parameter         | Default                     |
|-------------------|-----------------------------|
| number_of_events  | 5                           |
| calendar_entity   | calendar.llm_vision_calendar|
