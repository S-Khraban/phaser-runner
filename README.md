## 🧠 About the Project

This is a **side-scrolling 2D platformer built with Phaser**, where the level is **dynamically generated along the X axis**.

Gameplay:
- procedural platforms and obstacles
- interaction with **boxes** (pick up / carry / throw / push)
- items: **coin🪙, heart❤️, pickaxe⛏️**
- hazards: **stalactites**
- HUD: **pause ⏸️ + mute/unmute 🔇🔊**
- clear separation of logic and visuals (physics body separate from view)

---

## 🔊 Audio & Mute

The game uses an **Audio Manager** (`src/audio/createAudio.js`):

- looping background music
- SFX: coin / boom / gameover
- **🔇/🔊 button** next to pause in the HUD

Mute/unmute is implemented via:

- `scene.sound.mute = true/false`

This means:
- base `volume` values are **not modified**
- music is **not stopped**, only muted/unmuted
- when unmuted, audio resumes **without restarting** the track

---

## 🧩 Architecture

The project is organized into folders: **scenes / systems / entities / ui / anims / audio**.

Core principle:

👉 **Logic ≠ View**

- physics body — separate
- visual representation — separate
- linked via `setData('view', ...)` (or a stored reference inside the entity)

This allows:
- swapping sprites without rewriting physics
- avoiding collider-related bugs
- animating objects without breaking collisions

---

## 📦 Structure

public/
├─ images/ # PNG assets (sprites, backgrounds)
├─ sound/ # audio
└─ favicon.png

src/
├─ anims/ # animation registration
├─ audio/ # audio manager and constants
│ ├─ audio.constants.js
│ └─ createAudio.js
├─ entities/ # spawn/create entity functions
├─ input/ # input creation
├─ scenes/ # scenes and configs
├─ systems/ # game systems (logic)
├─ ui/ # HUD and modals
├─ main.js
└─ style.css

index.html
package-lock.json

yaml
Копіювати код

---

## 🧱 LevelStream — Procedural Generation

The `LevelStream` system:
- generates platforms ahead of the camera
- spawns boxes / rocks / items based on rules
- cleans up old objects behind the camera

---

## 🧍 Player Systems

- movement and jump (separate systems)
- camera follows the player
- respawn system:
  - finds the nearest safe platform
  - spawns the player above the platform
  - resets states (pickaxe/carry)

---

## 📦 Box Carry System

Features:
- pick up a box
- carry it
- throw with impulse
- push it

State stored via `player.setData()`:
- `isCarrying`
- `hasPickaxe`

---

## ⛏ Pickaxe / 💥 FX / Items

- pickaxe affects box breaking (durability shown in HUD)
- coins/hearts/items have correct colliders and spawn offsets
- box explosion/dust FX use a 24×24 spritesheet (PNG with transparency)

---

## 🚀 Run

```bash
npm install
npm run dev

## 🧠 Про проєкт

Це **side-scrolling 2D платформа на Phaser**, де рівень **динамічно генерується по X**.

Геймплей:
- процедурні платформи та перешкоди
- взаємодія з **ящиками** (підняти / нести / кинути / штовхати)
- предмети: **coin🪙, heart❤️, pickaxe⛏️**
- небезпеки: **сталактити**
- HUD: **пауза ⏸️ + mute/unmute 🔇🔊**
- логіка та візуал розділені (physics body окремо від view)

---

## 🔊 Аудіо та Mute

У грі є **Audio Manager** (`src/audio/createAudio.js`):

- фоновий трек (loop)
- SFX: coin / boom / gameover
- кнопка **🔇/🔊** біля паузи в HUD

Mute/unmute реалізовано правильно через:

- `scene.sound.mute = true/false`

Це означає:
- ми **не змінюємо** базові `volume`
- музика **не зупиняється**, а просто вимикається/вмикається
- при unmute звук повертається без “перезапуску” треку

---

## 🧩 Архітектура

Проєкт організований по папках: **scenes / systems / entities / ui / anims / audio**.

Ключовий принцип:

👉 **Logic ≠ View**

- physics body — окремо
- візуальне відображення — окремо
- звʼязок через `setData('view', ...)` (або посилання всередині сутності)

Це дозволяє:
- міняти спрайти без переписування фізики
- уникати багів з колайдерами
- анімувати об’єкти без ламання зіткнень

---

## 📦 Структура

public/
├─ images/ # PNG-асети (спрайти, бекграунди)
├─ sound/ # аудіо
└─ favicon.png

src/
├─ anims/ # реєстрація анімацій
├─ audio/ # аудіо менеджер та константи
│ ├─ audio.constants.js
│ └─ createAudio.js
├─ entities/ # spawn/create-функції сутностей
├─ input/ # створення контролів
├─ scenes/ # сцени та конфіги
├─ systems/ # ігрові системи (логіка)
├─ ui/ # HUD та модалки
├─ main.js
└─ style.css

index.html
package-lock.json

yaml
Копіювати код

---

## 🧱 LevelStream — процедурна генерація

Система `LevelStream`:
- генерує платформи попереду камери
- спавнить ящики / каміння / предмети з правилами
- очищає старі обʼєкти позаду камери

---

## 🧍 Player Systems

- рух та стрибок (окремі системи)
- камера слідує за гравцем
- respawn система:
  - пошук найближчої платформи
  - спавн вище платформи
  - скидання станів (pickaxe/carry)

---

## 📦 Box Carry System

Можливості:
- підняття ящика
- перенесення
- кидок з імпульсом
- штовхання

Стан через `player.setData()`:
- `isCarrying`
- `hasPickaxe`

---

## ⛏ Pickaxe / 💥 FX / Items

- кирка впливає на ламання ящиків (durability показується в HUD)
- монети/серця/предмети мають коректні колайдери та spawn offset
- вибух/пил для ящика — spritesheet 24×24 (PNG з прозорістю)

---

## 🚀 Запуск

```bash
npm install
npm run dev