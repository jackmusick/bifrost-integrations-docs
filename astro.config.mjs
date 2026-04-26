// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeBlack from "starlight-theme-black";

// https://astro.build/config
export default defineConfig({
    redirects: {
        "/core-concepts/app-builder": "/core-concepts/apps/",
        "/core-concepts/manifest-structure":
            "/how-to-guides/portability/manifest-format/",
    },
    vite: {
        server: {
            host: true,
            allowedHosts: [".ngrok-free.app", ".ngrok.io", "development"],
            watch: {
                usePolling: true,
                interval: 1000, // Check every 100ms
            },
        },
    },
    integrations: [
        starlight({
            title: "Bifrost Docs",
            description:
                "Documentation for Bifrost - Open-source workflow automation for MSPs",
            logo: {
                src: "./src/assets/logo-square.svg",
            },
            favicon: "/src/assets/logo-square.svg",
            customCss: ["./src/styles/custom.css"],
            head: [
                {
                    tag: "script",
                    attrs: { type: "module" },
                    content:
                        "import mediumZoom from 'https://cdn.jsdelivr.net/npm/medium-zoom@1.1.0/+esm'; const sel = '.sl-markdown-content img'; const z = mediumZoom(sel, { background: 'rgba(0,0,0,0.92)' }); document.addEventListener('astro:page-load', () => { z.detach(); z.attach(sel); });",
                },
            ],
            social: [
                {
                    icon: "github",
                    label: "GitHub",
                    href: "https://github.com/jackmusick/bifrost",
                },
            ],
            sidebar: [
                {
                    label: "About",
                    items: [
                        {
                            label: "What is Bifrost?",
                            slug: "about",
                        },
                        {
                            label: "Why Open Source?",
                            slug: "about/why-open-source",
                        },
                        {
                            label: "License (AGPL)",
                            slug: "about/license",
                        },
                    ],
                },
                {
                    label: "Getting Started",
                    items: [
                        {
                            label: "Installation Guide",
                            slug: "getting-started/installation",
                        },
                        {
                            label: "For Non-Developers",
                            slug: "getting-started/for-non-developers",
                        },
                        {
                            label: "Build Your First Workflow",
                            slug: "getting-started/first-workflow",
                        },
                        {
                            label: "Create Dynamic Forms",
                            slug: "getting-started/creating-forms",
                        },
                        {
                            label: "Integrations",
                            slug: "getting-started/integrations",
                        },
                    ],
                },
                {
                    label: "Core Concepts",
                    items: [
                        {
                            label: "Platform Overview",
                            slug: "core-concepts/platform-overview",
                        },
                        { label: "Workflows", slug: "core-concepts/workflows" },
                        {
                            label: "Workflow Registration",
                            slug: "core-concepts/discovery-system",
                        },
                        { label: "Forms", slug: "core-concepts/forms" },
                        { label: "Apps", slug: "core-concepts/apps" },
                        { label: "Tables", slug: "core-concepts/tables" },
                        { label: "Knowledge", slug: "core-concepts/knowledge" },
                        { label: "Agents", slug: "core-concepts/agents" },
                        { label: "Chat", slug: "core-concepts/chat" },
                        {
                            label: "Integrations",
                            slug: "core-concepts/integrations",
                        },
                        { label: "Events", slug: "core-concepts/events" },
                        {
                            label: "Permissions",
                            slug: "core-concepts/permissions",
                        },
                        { label: "Scopes", slug: "core-concepts/scopes" },
                    ],
                },
                {
                    label: "How-To Guides",
                    collapsed: true,
                    items: [
                        {
                            label: "Workflows",
                            collapsed: true,
                            items: [
                                {
                                    label: "Writing Workflows",
                                    slug: "how-to-guides/workflows/writing-workflows",
                                },
                                {
                                    label: "Using Decorators",
                                    slug: "how-to-guides/workflows/using-decorators",
                                },
                                {
                                    label: "Error Handling",
                                    slug: "how-to-guides/workflows/error-handling",
                                },
                                {
                                    label: "Webhook & Event Variables",
                                    slug: "how-to-guides/workflows/webhook-variables",
                                },
                            ],
                        },
                        {
                            label: "Forms",
                            collapsed: true,
                            items: [
                                {
                                    label: "Cascading Dropdowns",
                                    slug: "how-to-guides/forms/cascading-dropdowns",
                                },
                                {
                                    label: "Dynamic Fields",
                                    slug: "how-to-guides/forms/visibility-rules",
                                },
                                {
                                    label: "Personalized Messages",
                                    slug: "how-to-guides/forms/html-content",
                                },
                                {
                                    label: "Pre-fill Forms from URLs",
                                    slug: "how-to-guides/forms/startup-workflows",
                                },
                                {
                                    label: "Reference Context Data",
                                    slug: "how-to-guides/forms/context-field-references",
                                },
                            ],
                        },
                        {
                            label: "Integrations",
                            collapsed: true,
                            items: [
                                {
                                    label: "Store API Keys Securely",
                                    slug: "how-to-guides/integrations/secrets-management",
                                },
                                {
                                    label: "Automate Microsoft 365",
                                    slug: "how-to-guides/integrations/microsoft-graph",
                                },
                                {
                                    label: "Custom REST APIs",
                                    slug: "how-to-guides/integrations/creating-integrations",
                                },
                            ],
                        },
                        {
                            label: "Local Development",
                            collapsed: true,
                            items: [
                                {
                                    label: "Setup",
                                    slug: "how-to-guides/local-dev/setup",
                                },
                                {
                                    label: "AI Coding Guide",
                                    slug: "how-to-guides/local-dev/ai-coding",
                                },
                            ],
                        },
                        {
                            label: "Authentication",
                            collapsed: true,
                            items: [
                                {
                                    label: "Configure SSO",
                                    slug: "how-to-guides/authentication/sso",
                                },
                                {
                                    label: "Passkeys (WebAuthn)",
                                    slug: "how-to-guides/authentication/passkeys",
                                },
                            ],
                        },
                        {
                            label: "Portability",
                            collapsed: true,
                            items: [
                                {
                                    label: "Exporting and Importing",
                                    slug: "how-to-guides/portability/exporting-importing",
                                },
                                {
                                    label: "Manifest Format",
                                    slug: "how-to-guides/portability/manifest-format",
                                },
                            ],
                        },
                        {
                            label: "User Interface",
                            collapsed: true,
                            items: [
                                {
                                    label: "Keyboard Shortcuts",
                                    slug: "how-to-guides/ui/keyboard-shortcuts",
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Reference",
                    collapsed: true,
                    items: [
                        {
                            label: "SDK",
                            collapsed: true,
                            items: [
                                {
                                    label: "Agents Module",
                                    slug: "sdk-reference/sdk/agents-module",
                                },
                                {
                                    label: "AI Module",
                                    slug: "sdk-reference/sdk/ai-module",
                                },
                                {
                                    label: "Bifrost Module",
                                    slug: "sdk-reference/sdk/bifrost-module",
                                },
                                {
                                    label: "Config Module",
                                    slug: "sdk-reference/sdk/config-module",
                                },
                                {
                                    label: "Context API",
                                    slug: "sdk-reference/sdk/context-api",
                                },
                                {
                                    label: "Decorators",
                                    slug: "sdk-reference/sdk/decorators",
                                },
                                {
                                    label: "Email Module",
                                    slug: "sdk-reference/sdk/email-module",
                                },
                                {
                                    label: "Executions Module",
                                    slug: "sdk-reference/sdk/executions-module",
                                },
                                {
                                    label: "External SDK",
                                    slug: "sdk-reference/sdk/external-sdk",
                                },
                                {
                                    label: "Files Module",
                                    slug: "sdk-reference/sdk/files-module",
                                },
                                {
                                    label: "Integrations Module",
                                    slug: "sdk-reference/sdk/integrations-module",
                                },
                                {
                                    label: "Knowledge Module",
                                    slug: "sdk-reference/sdk/knowledge-module",
                                },
                                {
                                    label: "Organizations Module",
                                    slug: "sdk-reference/sdk/organizations-module",
                                },
                                {
                                    label: "Roles Module",
                                    slug: "sdk-reference/sdk/roles-module",
                                },
                                {
                                    label: "Tables Module",
                                    slug: "sdk-reference/sdk/tables-module",
                                },
                                {
                                    label: "Users Module",
                                    slug: "sdk-reference/sdk/users-module",
                                },
                                {
                                    label: "Webhooks Module",
                                    slug: "sdk-reference/sdk/webhooks-module",
                                },
                            ],
                        },
                        {
                            label: "Apps",
                            collapsed: true,
                            items: [
                                {
                                    label: "Code-Based Apps",
                                    slug: "sdk-reference/app-builder/code-apps",
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Troubleshooting",
                    collapsed: true,
                    items: [
                        { label: "OAuth", slug: "troubleshooting/oauth" },
                        {
                            label: "Workflow Engine",
                            slug: "troubleshooting/workflow-engine",
                        },
                        { label: "Forms", slug: "troubleshooting/forms" },
                    ],
                },
            ],
            components: {
                // Override default components if needed
            },
            plugins: [starlightThemeBlack({})],
        }),
    ],
});
