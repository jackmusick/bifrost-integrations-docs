// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeBlack from "starlight-theme-black";

// https://astro.build/config
export default defineConfig({
    vite: {
        server: {
            host: true,
            allowedHosts: [".ngrok-free.app", ".ngrok.io"],
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
                        { label: "Forms", slug: "core-concepts/forms" },
                        {
                            label: "Workflow Discovery",
                            slug: "core-concepts/discovery-system",
                        },
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
                                    label: "Bifrost Module",
                                    slug: "sdk-reference/sdk/bifrost-module",
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
                                    label: "External SDK",
                                    slug: "sdk-reference/sdk/external-sdk",
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
