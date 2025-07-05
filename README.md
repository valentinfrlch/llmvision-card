<p align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./logos/dark_logo@2x.png">
  <img alt="LLM Vision Logo" src="./logos/logo@2x.png" width="512">
</picture></p>
<h1 align=center>Timeline Card</h1>
<p align=center>
<img src=https://img.shields.io/badge/HACS-Custom-orange.svg>
<img src=https://img.shields.io/badge/version-1.5.0-blue>
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
  <a href="https://llmvision.org/card"> Visit Website →</a>
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

# Configuration
## Timeline Card
<img src="https://github.com/user-attachments/assets/b9402784-52aa-409d-be04-1fce47f2e658" width="40%">

>[!TIP]
>If both `number_of_events` and `number_of_hours` are set, the card will show events that occurred within the past specified number of hours, up to the specified number of events.


| Parameter         | Description                                                                                                 | Default                      |
|-------------------|-------------------------------------------------------------------------------------------------------------|------------------------------|
| entity            | LLM Vision Timeline Entity (needs to be set up in LLM Vision Settings first)                                |`calendar.llm_vision_timeline`|
| number_of_hours   | Show events that occurred within the past specified number of hours.                                        | 24                           |
| number_of_events  | How many events to show. Maximum is 10.                                                                     | 5                            |
| category_filters  | Only show events matching one of the specified categories.                                                  | `[]`                         |
| camera_filters    | Only show events matching one of the specified cameras.                                                     | `[]`                         |
| custom_colors     | Custom colors for categories. Colors must be specified as a dictionary where keys are category names and values are lists of RGB values (e.g., `[255, 255, 0]`). See the example configuration below for details.    | `[]`                         |
| language          | Language used for UI and generate icons (supports: `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `sv`, `sk`)    | `en`                         |

### Example Configuration
```yaml
type: custom:llmvision-card
entity: calendar.llm_vision_timeline
number_of_hours: 24
number_of_events: 5
language: en
category_filters:
  - people
  - animals
  - vehicles
custom_colors:
  people:
    - 251
    - 255
    - 0
  vehicles:
    - 143
    - 143
    - 143
```

## Preview Card
<img src="https://github.com/user-attachments/assets/fce64634-cb68-4d8c-bd69-7e640a2de62c" width="40%">

| Parameter         | Description                                                                                                 | Default                      |
|-------------------|-------------------------------------------------------------------------------------------------------------|------------------------------|
| entity            | LLM Vision Timeline Entity (needs to be set up in LLM Vision Settings first)                                |`calendar.llm_vision_timeline`|
| category_filters  | Only show events matching one of the specified categories.                                                  | `[]`                         |
| camera_filters    | Only show events matching one of the specified cameras.                                                     | `[]`                         |
| language          | Language used for UI and generate icons (supports: `de`, `en`, `es`, `fr`, `it`, `nl`, `pl`, `pt`, `sv`, `sk`)    | `en`                         |

### Example Configuration
```yaml
type: custom:llmvision-preview-card
entity: calendar.llm_vision_timeline
language: en
category_filters:
  - people
camera_filters:
  - camera.garage
```

## Support
You can support this project by starring this GitHub repository. If you want, you can also buy me a coffee here:  
<br>
<a href="https://www.buymeacoffee.com/valentinfrlch"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=valentinfrlch&button_colour=FFDD00&font_colour=000000&font_family=Inter&outline_colour=000000&coffee_colour=ffffff" /></a>
