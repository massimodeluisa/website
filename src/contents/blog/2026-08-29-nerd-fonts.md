---
title: Named glyphs, not empty boxes
date: 2026-08-29
category: tech
excerpt: The nerd-fonts skill makes a coding agent pick a named Nerd Fonts glyph, write the class next to the codepoint, and tell you which patched family to install. Lookup is grep on a 10,995-row snapshot of v3.5.1. Review mode catches emoji, leftover nf-mdi- classes, and Cascadia Code where the patched name is CaskaydiaCove.
readingTime: 12
cover: /journal/2026-08-29/nerd-fonts-og.png
coverAlt: Open Graph card for the Nerd Fonts skill
---

When a coding agent writes a prompt, a TUI, a statusline, an editor config, or a web page that needs an icon, it will, unless you stop it, paste an emoji, an ASCII stand-in such as `E:` or `->`, or a codepoint it remembers from a gist. Those icon fonts live in Unicode's Private Use Area. Without a patched face they render as empty boxes, the thing terminal people call tofu. Ryan L McIntyre's [Nerd Fonts](https://www.nerdfonts.com) project exists to make that PUA usable: it patches developer fonts with a fixed set of icons, currently 10,995 named glyphs in [v3.5.1](https://github.com/ryanoasis/nerd-fonts/releases/tag/v3.5.1) (21 August 2026), drawn from Devicons, Font Awesome and its extension, Material Design Icons, Weather, Octicons, Codicons, Font Logos, Pomicons, Powerline and Powerline Extra, IEC Power Symbols, and Seti-UI plus Custom. It ships 72 patched families, a Symbols Only font, and a patcher for any other face. The aggregation and the patcher are MIT; every original font keeps its own license, and the Nerd Fonts logo in the social preview is SIL OFL 1.1. [nerd-fonts](https://github.com/massimodeluisa/nerdfonts-skill) is the Agent Skill I published so that Claude Code, Codex, Cursor, and the others would pick a named glyph from that cheat sheet, or from the snapshot I bundle, write the class next to the codepoint, and tell you which patched family to install, because the family string in your `kitty.conf` is not the name on the download page. Independent project, not affiliated with Nerd Fonts. I released it on 28 August 2026; this note is the next day.

This journal self-hosts a tiny subset of Symbols Only, so the glyphs in this post should be the icons, not tofu. If you still see empty boxes, the webfont did not load.

## What the skill is for

Every icon in CLI output, TUIs, prompts, statuslines, editor and terminal configs, docs, and web UI is a Nerd Fonts glyph taken from the [cheat sheet](https://www.nerdfonts.com/cheat-sheet), from `data/glyphs.tsv` in the skill (the same `glyphnames.json` as upstream, snapshotted at v3.5.1), or from live `glyphnames.json` if you need newer than the snapshot. The agent does not invent a codepoint. It writes the glyph next to its name and codepoint, and it keeps one icon set per surface so that git chrome stays in Octicons (`nf-oct-`, 310 glyphs,  `nf-oct-mark_github` U+F408,  `nf-oct-git_branch` U+F418), editor UI and LSP kinds stay in Codicons (`nf-cod-`, 540), languages and file types stay in Devicons and Seti ( `nf-dev-rust` U+E7A8), prompt separators stay in Powerline (`nf-pl-` / `nf-ple-`), and general UI can use Material Design (`nf-md-`, 6,896, 󰉋 `nf-md-folder` U+F024B) or Font Awesome (`nf-fa-`, 1,818,  `nf-fa-heart` U+F004).

```js
icon = ""  // nf-oct-mark_github U+F408
```

## Fonts, names, and variants

It also has to tell you that a Nerd Font must be active on the rendering surface, and send you to [font-downloads](https://www.nerdfonts.com/font-downloads) with the package name, the patched family, and the variant, because Reserved Font Names rename on patch: Cascadia Code becomes `CaskaydiaCove Nerd Font`, Source Code Pro becomes `SauceCodePro Nerd Font`, IBM Plex Mono becomes `BlexMono Nerd Font`. The full list lives in `references/fonts.md`. If you want to keep your current text font, the skill installs Symbols Only (`Symbols Nerd Font` / `Symbols Nerd Font Mono`) and lets the app fall back: fontconfig users copy `10-nerd-font-symbols.conf` into `~/.config/fontconfig/conf.d/`, kitty uses `symbol_map`, WezTerm `font_with_fallback`, iTerm2 "Use a different font for non-ASCII text". Ghostty and WezTerm already bundle the symbols. Upstream documents fallback placement as hit or miss; kitty can correct it with `modify_font baseline`, WezTerm with a fallback `scale`. Where columns must line up, the Mono variant puts each icon in one cell; Regular is about 1.5 cells and Propo is proportional, for GUI apps and slides. The variant changes only the added icons, never the base letters. CLIs that might run without a Nerd Font get `--no-icons` or `NO_ICONS=1`. Chosen glyphs are printed with `printf` and checked before anyone claims they render.

## On the web

On the web, the page loads `webfont.css` or self-hosts `SymbolsNerdFont-Regular.ttf` from `NerdFontsSymbolsOnly.zip` (self-host in production rather than hot-linking nerdfonts.com). This site does the second thing: a WOFF2 subset under `/fonts/nerd-fonts/`, wired as a fallback after Geist, with a `unicode-range` limited to the Private Use Area. Decorative icons get `aria-hidden="true"`; icon-only controls get an accessible name. A Private Use Area character without a covering font is tofu in the browser. Upstream `.nf` sets `line-height: 1`; start `vertical-align` at `-0.125em` and look at a mixed text-and-icon line, because an icon font sits on a different baseline than the text font. Mix a few here and see:  󰉋  .

## Lookup

Lookup is deliberately a small window. `grep -i 'folder' data/glyphs.tsv` or `awk -F'\t' '$1=="md-folder"' data/glyphs.tsv` against the snapshot; the TSV is never dumped into context. `references/common-icons.md` is a short list by purpose, backed by `data/common-icons.txt`. `references/icon-concepts.md` has the same concept in md, fa, oct, cod, and seti, twenty-two of them, for when a surface must stay in one set. `references/glyph-sets.md` has prefixes, ranges, and extra language escapes. Material Design Icons moved in v3 from `nf-mdi-*` (U+F001 to U+F847) to `nf-md-*` (U+F0001 to U+F1AF0), and some names were dropped, so a removed `nf-mdi-altimeter` is searched as the bare word `altimeter` on the cheat sheet. The folder you want now is 󰉋 `nf-md-folder` U+F024B.

Powerline names lie about direction:  `nf-pl-left_hard_divider` U+E0B0 points right, and  `nf-pl-right_hard_divider` U+E0B2 points left, because the names describe the side of the cell the triangle sits on. Homebrew casks are `font-<kebab-patched-name>-nerd-font`; `brew install --cask font-jetbrains-mono-nerd-font` is the JetBrains one, and dropping `--cask` or the hyphens asks for a formula that does not exist. The font is installed on the machine that runs the terminal; over ssh the remote host does not need it. kitty's family string is `font_family JetBrainsMono Nerd Font`. The verification line is:

```bash
printf '  󰉋\n'
```

That is  `nf-custom-vim` U+E62B,  `nf-oct-mark_github` U+F408, and 󰉋 `nf-md-folder` U+F024B. `fc-list` is missing on stock macOS, so the skill uses `brew install fontconfig`, or `kitty +list-fonts`, or the `printf` alone.

## Review

Review mode is `/nerd-fonts <file>` against a script, a TUI source, a prompt config, an editor or terminal config, HTML or CSS. For each finding it quotes the line, says why in one sentence, and gives the fix: the exact glyph with `nf-<set>-<name>` and `U+XXXX`, or the exact config line. The checklist uses `perl` (it ships on macOS and Linux) for emoji and dingbats, `grep -n 'nf-mdi-'` for leftover Material classes, a PUA scan for glyphs without their name and codepoint, a family-name scan for unpatched faces (Cascadia Code, Source Code Pro, IBM Plex Mono, and the rest of that list), and `grep -L` for HTML or CSS that uses glyphs but loads neither `webfont.css` nor `@font-face`. Text markers such as `E:`, `W:`, `[x]`, and `->` in status lines have no reliable regex, so the agent has to read the file. A deploy line that printed `ok` / `warning` / `error` should come back with something like 󰄬 `nf-md-check` U+F012C, 󰀨 `nf-md-alert_circle` U+F0028, 󰅙 `nf-md-close_circle` U+F0159, one set, comments from the TSV.

## How I test it

How I test that the agent actually does this is five scenarios in `evals/evals.json`, written as assertions against `data/glyphs.tsv`, not as CI that launches a model. The first is a macOS user on kitty and starship whose prompt icons are empty boxes: the skill has to link font-downloads, name cask `font-jetbrains-mono-nerd-font`, give family `JetBrainsMono Nerd Font` and `font_family JetBrainsMono Nerd Font` in kitty.conf, print a `printf` of named glyphs from the TSV, mention Mono when columns must line up, and point at the starship nerd-font-symbols preset, without inventing a codepoint. The second asks for glyph, hex, and class of the Octicons GitHub mark, Font Awesome heart, Devicons rust, Material Design folder, and the Powerline right-pointing solid separator, plus what happened to `nf-mdi-folder`. Gold is  `nf-oct-mark_github` U+F408,  `nf-fa-heart` U+F004,  `nf-dev-rust` U+E7A8, 󰉋 `nf-md-folder` U+F024B,  `nf-pl-left_hard_divider` U+E0B0 (not  `right_hard_divider`), and a bare-name explanation of the mdi-to-md move, without telling anyone to pin Nerd Fonts v2. The third is Ubuntu 24.04, Neovim with nvim-tree, GNOME Terminal showing tofu, user wants to keep the text font: Symbols Only, `10-nerd-font-symbols.conf`, `fc-cache`, `printf`, and no replacement of the text face. The fourth is a `deploy-status.sh` that prints a git branch and five services with ok, warning, error, pending, or unknown: named glyphs with comments from the TSV, one set per surface, no emoji, `--no-icons` or `NO_ICONS=1`, a font-downloads note, Mono or a caveat about columns, and `printf` rather than `echo`. The fifth reviews a `starship.toml` full of emoji, a lualine snippet with `E:` / `W:` and `nf-mdi-folder`, and a `kitty.conf` that still says `font_family Cascadia Code`. Each finding has to quote the line. Cascadia becomes CaskaydiaCove, cask `font-caskaydia-cove-nerd-font`. Replacement glyphs come from the TSV. No invented nvim-web-devicons APIs.

## Upstream

A clone-only Rust helper, `tools/nfskill`, validates every glyph name and codepoint in this repository against the snapshot. It does not ship inside the skill directory; the skill itself stays `grep` and `awk`. Weekly CI watches upstream, so a new Nerd Fonts release, or a Homebrew cask that stops resolving, opens an issue. When upstream ships, regenerate `glyphs.tsv`, recompute glyph-sets and fonts, update the tag in `SKILL.md`, write the changelog, then `cargo run --manifest-path tools/nfskill/Cargo.toml -- validate`.

## Install

Install with the skills CLI:

```bash
npx skills add massimodeluisa/nerdfonts-skill
```

Listed at [skills.sh/massimodeluisa/nerdfonts-skill](https://skills.sh/massimodeluisa/nerdfonts-skill). Add `-g` for a user-level install. `/nerd-fonts` applies the policy to the conversation. `/nerd-fonts ~/.config/starship.toml` reviews that file. Font downloads stay on [nerdfonts.com/font-downloads](https://www.nerdfonts.com/font-downloads). The cheat sheet stays on [nerdfonts.com/cheat-sheet](https://www.nerdfonts.com/cheat-sheet). If a class in the snapshot is wrong, [Edit on GitHub](https://github.com/massimodeluisa/nerdfonts-skill).
