#!/usr/bin/env pwsh

Copy-Item -Path ./.env -Destination ./strapi -Force
Copy-Item -Path ./.env -Destination ./frontend/prisma -Force
