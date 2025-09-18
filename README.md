# caloMeter

CaloMeter is a next-generation calorie-tracking app that leverages **AI-powered food recognition** with **Web3 privacy tools** to deliver unmatched accuracy and user control.

Built entirely **without a traditional backend** – powered by \*\*Xion abstraction

## What it does

- Lets users take/upload pictures of their meals.
- AI model detects food items and estimates portion sizes & calories.
- Uses blockchain to ensure privacy and verify nutrition data integrity.
- Provides an interface for users to view their calorie/nutrition history.
- Data is stored and verified **on-chain**, not on a central server.
- **Reclaim + Xion abstraction** ensure secure authentication and smooth Web3 integration.
- Users retain full ownership and control over their nutrition history.

## How we built it

- **Frontend:** TypeScript + React Native/Expo(54) + Gluestack + Tailwind(Nativewind) for mobile UI.
- **AI:** Google Generative AI.
- **API:** Open Food Facts.
- **Web3 Layer:**
    - **Xion Abstraction:** Simplifies wallet interactions and abstracts complex blockchain UX.
    - **Reclaim Protocol:** Provides privacy-preserving identity and data-sharing.
    - **Decentralized storage/Web3:** Nutrition logs remain user-owned.
- **No traditional backend:** All logic runs client-side + decentralized infrastructure.
- **Privacy Layer:** Blockchain to protect and verify user data.
- **Tooling:** Tailwind for UI, ESLint/Prettier/Commitlint for clean code.

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/blessingtutka/calo-meter.git
cd calo-meter
cp .env.example .env   # fill in environment variables
npm install
# or yarn / pnpm install

# Run development server
npm run start
# Or for mobile: expo start / react-native run / etc.

# For web
npm run web

# For Android/IOS building production
npm run android

npm run ios

# For blockchain backend, ensure smart contracts are deployed, node / provider configured.
```
