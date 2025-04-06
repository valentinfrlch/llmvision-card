<p align="center">
<img src="https://github.com/user-attachments/assets/bebd92b8-765e-4d63-bb3d-47e1bb8b51ad" width=500px>
</p>
<h1 align=center>Timeline Card</h1>
<p align=center>
<img src=https://img.shields.io/badge/HACS-Custom-orange.svg>
<img src=https://img.shields.io/badge/version-1.4.2-blue>
<img src="https://img.shields.io/maintenance/yes/2025.svg">
<img alt="Issues" src="https://img.shields.io/github/issues/valentinfrlch/llmvision-card?color=0088ff"/>
<img alt="Static Badge" src="https://img.shields.io/badge/support-buymeacoffee?logo=buymeacoffee&logoColor=black&color=%23FFDD00&link=https%3A%2F%2Fbuymeacoffee.com%2Fvalentinfrlch">
    <p align=center style="font-weight:bold">
      Custom Card to display the LLM Vision Timeline on your Home Assistant Dashboard
    </p>
</p>

  <p align="center">
    <a href="#prerequisites">🌟 Prerequisites </a>
    ·
    <a href="#installation">⬇️ Installation</a>
    ·
    <a href="#setup">🚧 Setup</a>
    ·
    <a href="#configuration">🔧 Configuration</a>    
  </p>
<p align="center">
  <a href="https://llmvision.org"> Visit Website →</a>
    </p>

<img src="https://github.com/user-attachments/assets/97f6e608-bdf3-44d1-89f1-fd89cda7b764" width="50%" height="auto" />

## Prerequisites
1. [LLM Vision](https://github.com/valentinfrlch/ha-llmvision) set up in Home Assistant
2. Timeline provider set up in LLM Vision
3. Blueprint or Automation to add events to the timeline

## Documentation
<a href="https://llm-vision.gitbook.io/getting-started/setup/timeline-card-beta"><img src="https://img.shields.io/badge/Documentation-blue?style=for-the-badge&logo=gitbook&logoColor=white&color=18bcf2"/> </a>

## Installation
Add the repository to HACS and install the LLM Vision card using this link:
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=valentinfrlch&repository=llmvision-card&category=plugin)

Alternatively you can add the url of this repository to the custom respositories list in HACS.

## Setup
1. Install the card through HACS
2. Reload
3. Add the card to your dashboard

## Configuration
>[!TIP]
>If both `number_of_events` and `number_of_hours` are set, the card will show events that occurred within the past specified number of hours, up to the specified number of events.


| Parameter         | Description                                                                                                 | Default                      |
|-------------------|-------------------------------------------------------------------------------------------------------------|------------------------------|
| number_of_events  | How many events to show. Maximum is 10.                                                                     | 5                            |
| number_of_hours   | Show events that occurred within the past specified number of hours.                                        | 10                           |
| calendar_entity   | LLM Vision Timeline Entity (needs to be set up in LLM Vision Settings first)                                |`calendar.llm_vision_timeline`|
| refresh_interval  | Refresh Interval (in seconds)                                                                               | 10                           |
| language          | Language used for UI and generate icons (supports: `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `sv`)    | `en`                         |

## Support
You can support this project by starring this GitHub repository. If you want, you can also buy me a coffee here:  
<br>
<a href="https://www.buymeacoffee.com/valentinfrlch"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=valentinfrlch&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" /></a>
