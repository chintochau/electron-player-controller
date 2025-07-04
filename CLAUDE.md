# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BluOS Player Controller - An Electron desktop application for discovering and controlling BluOS-compatible music players on the local network.

## Development Commands

```bash
# Install dependencies
npm install

# Development - runs with hot reload
npm run dev

# Build for production
npm run build          # All platforms
npm run build:win      # Windows only
npm run build:mac      # macOS only  
npm run build:linux    # Linux only

# Preview built app
npm run start

# Code quality
npm run lint           # Run ESLint
npm run format         # Format with Prettier

# Publishing (requires S3 credentials)
npm run publish
```

## Architecture

### Process Architecture
- **Main Process** (`src/main/`): Handles all network communication, device discovery, and system integration
- **Renderer Process** (`src/renderer/`): React-based UI, receives data via IPC
- **Preload Script** (`src/preload/`): Secure bridge between main and renderer

### Key Communication Patterns

1. **Device Discovery**: Main process runs Bonjour/mDNS service discovery → sends device list to renderer via IPC
2. **Device Control**: Renderer requests action → Main process makes HTTP request to device → Returns response
3. **Status Updates**: Main process polls devices every 1-2 seconds → Broadcasts updates to all windows

### BluOS Protocol
- Devices communicate via HTTP on port 11000
- Responses are in XML format
- Key endpoints:
  - `/Status` - Current playback status
  - `/Browse` - Media browsing
  - `/Play`, `/Pause`, `/Skip` - Playback control
  - `/Volume` - Volume control
  - `/SyncStatus` - Group information

### State Management
The app uses React Context for state management:
- `DeviceContext`: Active device, discovered devices, device status
- `PlayersContext`: All players and their states
- `StatusContext`: Current playback status
- `ThemeContext`: Light/dark mode
- `GroupContext`: Player grouping state

### Key Features Implementation

1. **Device Discovery**: Uses `bonjour-service` to find `_musc._tcp` services
2. **SDUI (Server-Driven UI)**: Dynamically generates UI from XML responses (`src/renderer/src/lib/loadSDUI.js`)
3. **System Tray**: Separate window (`trayIndex.html`) with mini player controls
4. **Auto-Updates**: Uses `electron-updater` with S3 backend
5. **WiFi Management**: Platform-specific WiFi scanning and connection

### Component Structure
- UI components use shadcn/ui library (in `src/components/ui/`)
- Custom components in `src/renderer/src/components/`
- Shared utilities in `src/lib/`

### Important Files
- `src/main/index.js`: Main process entry, IPC handlers, window management
- `src/main/functions.js`: Device communication, API calls
- `src/renderer/src/App.jsx`: Main app component with routing
- `src/renderer/src/components/MainPlayerScreen.jsx`: Primary player interface
- `src/renderer/src/lib/loadSDUI.js`: Dynamic UI generation from XML