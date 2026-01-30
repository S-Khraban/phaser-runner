# 🎮 Phaser.js Game Project

This repository is the result of an iterative **2D game development process using Phaser.js**, with a strong focus on **architecture**, **game systems**, **physics**, **animations**, **procedural level generation**, and **clean engineering practices** (Git workflow, refactoring, system isolation).

The project evolved step by step: from primitive rectangles and placeholders to fully structured game entities with separated **logic**, **visual representation**, animations, and interactions.

---

## 🧠 Project Overview

This is a **side‑scrolling 2D platformer** where:

* the level is generated dynamically along the X axis
* the player interacts with platforms, boxes, rocks, and hazards
* collectible items are present (coin, heart, pickaxe)
* physics‑based interactions are implemented (carrying, throwing, pushing)
* logic and rendering are clearly separated

The project is designed not as a demo, but as a **solid foundation for a full‑scale game**.

---

## 🧩 Architecture

The repository structure reflects the current code organization and enforces separation of responsibilities between animations, entities, systems, UI, input, and scenes.

```
public/
├─ images/          # PNG assets (sprites, backgrounds, etc.)
├─ sound/           # audio assets
└─ favicon.png

src/
├─ anims/           # animation registrations
│  ├─ playerPickaxeHit.anim.js
│  └─ playerRun.anim.js
├─ entities/        # entity spawn / create functions
│  ├─ createPlayer.js
│  ├─ playerView.js
│  ├─ spawnIdlePlayer.js
│  ├─ spawnPickaxe.js
│  ├─ spawnPlatform.js
│  ├─ spawnBox.js
│  ├─ spawnRock.js
│  ├─ spawnStalactite.js
│  ├─ spawnHeart.js
│  ├─ spawnCoin.js
│  ├─ spawnCoinFromBox.js
│  └─ spawnExplosion.js
├─ input/
│  └─ createControls.js
├─ scenes/
│  ├─ GameScene.js
│  ├─ gameScene.constants.js
│  ├─ gameScene.helpers.js
│  └─ gameScene.bindings.js
├─ systems/         # core game systems (logic)
│  ├─ LevelStream.js
│  ├─ setupColliders.js
│  ├─ cameraFollow.js
│  ├─ playerMovement.js
│  ├─ playerJump.js
│  ├─ respawnSystem.js
│  ├─ boxCarrySystem.js
│  └─ createParallaxBg.js
├─ ui/
│  ├─ createHud.js
│  ├─ startModal.js
│  └─ startModalStyles.js
├─ main.js
└─ style.css

index.html
package-lock.json
```

### Core Principle

👉 **Logic ≠ View**

* physics bodies are independent from visuals
* rendering is handled via separate view objects
* connections are made through `setData('view', ...)` or explicit references

This approach allows:

* easy sprite replacement
* stable physics without visual side effects
* animation without breaking collisions

---

## 🧱 LevelStream — Procedural Generation

The `LevelStream` system is responsible for:

* spawning platforms ahead of the camera
* placing boxes, rocks, and items
* enforcing distance and probability rules
* cleaning up objects behind the camera

### Fixed Issues

* ❌ boxes spawning *inside* platforms
* ❌ physics bodies collapsing into a single point
* ❌ incorrect Y positioning

✔️ Current behavior:

* boxes always spawn **on top of platforms**
* physics bodies have proper dimensions
* views are synchronized with bodies

---

## 🧍 Player

The player consists of:

* a physics body (rectangle)
* a separate `playerView`

### Player Systems

* `playerMovement`
* `playerJump`
* `cameraFollow`
* `respawnSystem`

#### Respawn Logic

* detects the nearest valid platform
* respawns **200px above the platform**
* resets temporary states (pickaxe, carrying)

---

## 📦 Box Carry System

One of the most complex systems in the project.

Features:

* picking up boxes
* carrying them
* throwing with impulse
* pushing boxes with the shoulder

The system accounts for:

* player facing direction
* distance checks
* pickaxe state
* velocity and mass tuning

Player states are stored via `player.setData()`:

* `isCarrying`
* `hasPickaxe`

---

## ⛏ Pickaxe

* implemented as a separate entity
* uses runtime textures (Graphics → Texture)
* includes hit animation
* affects interactions with boxes

The pickaxe has its own view, offset, rotation, and depth handling.

---

## 💥 Animations

### Implemented:

* box destruction mini‑explosion
* dust / debris effects (8‑bit, 2D)
* pickaxe hit animation
* movement, jump, and push states

### Approach

* single‑row sprite sheets
* 24×24 frames
* PNG with transparency

---

## 🪙 Coin / ❤️ Heart

* generated via runtime textures using `Graphics`
* animated spawn behavior
* controlled spawn offsets

Fixed problems:

* ❌ multiple coins spawning unexpectedly
* ❌ incorrect Y position

✔️ Current behavior:

* exactly one coin per event
* predictable spawn height

---

## 🎥 Camera & Parallax

* camera smoothly follows the player
* parallax background system
* physics and render synchronization tested

---

## 🧪 Debugging & Refactoring

Throughout development:

* multiple hard resets of the `main` branch
* feature work via `develop` branches
* clean commits executed in a single command block
* full system rewrites without incremental hacks

This reflects a **deliberate focus on clean Git history and maintainability**.

---

## 🛠 Tech Stack

* **Phaser.js**
* ES Modules
* Arcade Physics
* Git / GitHub
* Procedural generation
* Runtime textures

---

## 🚀 Project Status

The project is in **active development**.

It is not a tutorial sample, but a **scalable base for a complete 2D game**.

## 🧠 Загальна ідея

Це **side‑scrolling 2D платформа**, де:

* рівень генерується динамічно по X
* гравець взаємодіє з платформами, ящиками, камінням
* присутні предмети (coin🪙, heart❤️, pickaxe⛏️)
* реалізовані фізичні взаємодії, перенесення обʼєктів, кидки, штовхання
* логіка та візуал чітко розділені

Проєкт побудований не як «demo», а як **база для повноцінної гри**.

---

## 🧩 Архітектура

Структура репозиторію відповідає поточній організації коду (анiмації, сутності, системи, UI, input) і підтримує принцип **розділення логіки та візуалу**.

```
public/
├─ images/          # PNG-асети (спрайти, бекграунди, тощо)
├─ sound/           # аудіо
└─ favicon.png

src/
├─ anims/           # реєстрація анімацій гравця
│  ├─ playerPickaxeHit.anim.js
│  └─ playerRun.anim.js
├─ entities/        # spawn/create-функції сутностей
│  ├─ createPlayer.js
│  ├─ playerView.js
│  ├─ spawnIdlePlayer.js
│  ├─ spawnPickaxe.js
│  ├─ spawnPlatform.js
│  ├─ spawnBox.js
│  ├─ spawnRock.js
│  ├─ spawnStalactite.js
│  ├─ spawnHeart.js
│  ├─ spawnCoin.js
│  ├─ spawnCoinFromBox.js
│  └─ spawnExplosion.js
├─ input/
│  └─ createControls.js
├─ scenes/
│  ├─ GameScene.js
│  ├─ gameScene.constants.js
│  ├─ gameScene.helpers.js
│  └─ gameScene.bindings.js
├─ systems/         # ігрові системи (логіка)
│  ├─ LevelStream.js
│  ├─ setupColliders.js
│  ├─ cameraFollow.js
│  ├─ playerMovement.js
│  ├─ playerJump.js
│  ├─ respawnSystem.js
│  ├─ boxCarrySystem.js
│  └─ createParallaxBg.js
├─ ui/
│  ├─ createHud.js
│  ├─ startModal.js
│  └─ startModalStyles.js
├─ main.js
└─ style.css

index.html
package-lock.json
```

### Ключовий принцип

👉 **Logic ≠ View**

* physics body — окремо
* візуальне відображення — окремо
* звʼязок через `setData('view', ...)` (або збереження посилання у сутності)

Це дозволяє:

* легко міняти спрайти без переписування фізики
* уникати багів з колайдерами
* анімувати об’єкти без ламання зіткнень

---

## 🧱 LevelStream — процедурна генерація

Реалізована система `LevelStream`, яка:

* генерує платформи попереду камери
* спавнить ящики, каміння, предмети
* контролює дистанції між обʼєктами
* очищає старі обʼєкти позаду камери

### Виправлені проблеми

* ❌ ящики зʼявлялись *в середині платформи*
* ❌ body був "крапочкою"
* ❌ неправильні Y‑координати

✔️ Тепер:

* ящик **завжди стоїть НА платформі**
* body має фізичний розмір
* view синхронізується з body

---

## 🧍 Player

Гравець реалізований як:

* physics‑body (rectangle)
* окремий `playerView`

### Системи гравця

* `createPlayerMovement`
* `createPlayerJump`
* `createCameraFollow`
* `createRespawnSystem`

#### Respawn logic

* визначення найближчої платформи
* спавн **вище платформи на 200px**
* скидання станів (pickaxe, carry)

---

## 📦 Box Carry System

Одна з найскладніших систем у проєкті.

Можливості:

* підняття ящика
* перенесення
* кидок з імпульсом
* штовхання плечем

Враховано:

* напрямок гравця
* дистанцію
* наявність кирки
* фізику маси та швидкості

Стан зберігається через `player.setData()`:

* `isCarrying`
* `hasPickaxe`

---

## ⛏ Pickaxe

* окрема сутність
* runtime‑texture (graphics → texture)
* анімація удару
* вплив на взаємодії з ящиками

Pickaxe має власний `view`, offset, angle та depth.

---

## 💥 Анімації

### Реалізовано:

* міні‑вибух ящика
* пил / крихти (8‑bit, 2D)
* анімація удару киркою
* рух, стрибок, штовхання

### Підхід

* sprite‑sheet в одну лінію
* кадри 24×24
* PNG з прозорістю

---

## 🪙 Coin / ❤️ Heart

* runtime‑textures через `Graphics`
* анімація появи
* коректний spawn offset

Було виправлено:

* ❌ монет створювалось забагато
* ❌ неправильний Y spawn

✔️ Тепер:

* одна монета
* контрольована позиція

---

## 🎥 Camera & Parallax

* камера слідує за гравцем
* паралакс‑бекграунд
* перевірка sync з фізикою

---

## 🧪 Дебаг і рефакторинг

Протягом розробки:

* десятки хард‑ресетів гілки `main`
* робота через `develop`
* чисті коміти «одним блоком команд»
* повні перебудови систем без коментарів

Це **свідомий підхід до чистоти історії Git**.

---

## 🛠 Технології

* **Phaser.js**
* ES Modules
* Physics Arcade
* Git / GitHub
* Procedural generation
* Runtime textures

---

## 🚀 Статус

Проєкт знаходиться у **активній фазі розробки**.

Це не просто навчальний приклад, а **фундамент для повноцінної гри** з масштабованою архітектурою.
