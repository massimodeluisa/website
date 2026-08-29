---
title: Named glyphs, not empty boxes
date: 2026-08-29
category: tech
excerpt: The nerd-fonts skill makes a coding agent pick a named glyph, write its class next to the codepoint, and name the patched font to install, because without that font the icon is an empty box. Lookup runs on a 10,995-row snapshot of Nerd Fonts v3.5.1.
readingTime: 10
cover: /journal/2026-08-29/nerd-fonts-og.png
coverAlt: Open Graph card for the Nerd Fonts skill
---

When a coding agent writes a prompt, a TUI, a statusline, an editor config, or a web page that needs an icon, it will paste an emoji, an ASCII stand-in such as `E:` or `->`, or a codepoint it remembers, unless you stop it. Those icons live in Unicode's Private Use Area. Without a patched font they render as empty boxes, the thing terminal people call *tofu*. This journal self-hosts a tiny subset of the Symbols Only font, so the glyphs in this post should render as icons. If you still see empty boxes, the webfont did not load.

[nerd-fonts](https://github.com/massimodeluisa/nerdfonts-skill) is the Agent Skill I published to make the agent pick a named glyph and write the class next to the codepoint. It also has to tell you which patched family to install, because the family string in `kitty.conf` is not the name on the download page. The skill is independent of Nerd Fonts. I released it on 28 August 2026 and wrote this note the next day.

## Where the glyphs come from

The sheet the agent picks from is Ryan L McIntyre's [Nerd Fonts](https://www.nerdfonts.com) project. Its version matters here because the skill works from a snapshot of it. [v3.5.1](https://github.com/ryanoasis/nerd-fonts/releases/tag/v3.5.1), from 21 August 2026, has 10,995 named glyphs drawn from Devicons, Font Awesome and its extension, Material Design Icons, Weather, Octicons, Codicons, Font Logos, Pomicons, Powerline and Powerline Extra, IEC Power Symbols, and Seti-UI plus Custom. The same release ships 72 patched families and a Symbols Only font, plus a patcher for any other face. The patcher is MIT, while each original font keeps its own license.

## One named glyph, one set per surface

With that sheet as the source, the first rule is that every icon the agent writes is a named Nerd Fonts glyph, whether it lands in CLI output, TUIs, prompts, statuslines, editor and terminal configs, docs, or web UI. It comes from the [cheat sheet](https://www.nerdfonts.com/cheat-sheet), from `data/glyphs.tsv` in the skill (the same `glyphnames.json` as upstream, snapshotted at v3.5.1), or from the live `glyphnames.json` if you need something newer than the snapshot. The agent does not invent a codepoint. It writes each glyph next to its name and codepoint.

The second rule keeps one icon set per surface. Git chrome stays in Octicons (`nf-oct-`, 310 glyphs,  `nf-oct-mark_github` U+F408,  `nf-oct-git_branch` U+F418). Editor UI and LSP kinds stay in Codicons (`nf-cod-`, 540). Languages and file types stay in Devicons and Seti ( `nf-dev-rust` U+E7A8), while prompt separators stay in Powerline (`nf-pl-` / `nf-ple-`). General UI can use Material Design (`nf-md-`, 6,896, 󰉋 `nf-md-folder` U+F024B) or Font Awesome (`nf-fa-`, 1,818,  `nf-fa-heart` U+F004).

In a source file, a glyph chosen this way sits next to its class and codepoint:

```js
icon = ""  // nf-oct-mark_github U+F408
```

On a machine without the font, the string between the quotes is an empty box. The comment is what lets a reader check the choice against the sheet.

## A patched font changes its name

Choosing the glyph solves half the problem, because a Nerd Font also has to be active on the surface that renders it. The skill sends you to [font-downloads](https://www.nerdfonts.com/font-downloads) with the package name, the patched family, and the variant. It has to name all three because Reserved Font Names rename on patch: Cascadia Code becomes `CaskaydiaCove Nerd Font`, Source Code Pro becomes `SauceCodePro Nerd Font`, and IBM Plex Mono becomes `BlexMono Nerd Font`. The full list lives in `references/fonts.md`.

If you want to keep your current text font, the skill installs Symbols Only (`Symbols Nerd Font` / `Symbols Nerd Font Mono`) and lets the app fall back to it. Each app has its own mechanism for that. With fontconfig, you copy `10-nerd-font-symbols.conf` into `~/.config/fontconfig/conf.d/`. kitty uses `symbol_map` and WezTerm uses `font_with_fallback`, while iTerm2 has a "Use a different font for non-ASCII text" setting. Ghostty and WezTerm already bundle the symbols. Upstream documents fallback placement as hit or miss, which kitty can correct with `modify_font baseline` and WezTerm with a fallback `scale`.

The variant decides how much room each icon takes. Where columns must line up, the Mono variant puts each icon in one cell. Regular is about 1.5 cells, while Propo is proportional, for GUI apps and slides. The variant changes only the added icons, never the base letters. CLIs that might run without a Nerd Font get `--no-icons` or `NO_ICONS=1`. Before anyone claims the chosen glyphs render, they are printed with `printf` and checked.

## Icons on a web page

A browser has the same dependency on a font. On the web, the page loads `webfont.css` or self-hosts `SymbolsNerdFont-Regular.ttf` from `NerdFontsSymbolsOnly.zip` (self-host in production rather than hot-linking nerdfonts.com). This site does the second thing with a WOFF2 subset under `/fonts/nerd-fonts/`, wired as a fallback after Geist. Its `unicode-range` is limited to the Private Use Area, so the browser reaches for the subset only for icon characters. A Private Use Area character without a covering font is tofu in the browser too.

Decorative icons get `aria-hidden="true"`, while icon-only controls get an accessible name. Upstream `.nf` sets `line-height: 1`. Start `vertical-align` at `-0.125em` and look at a mixed text-and-icon line, because an icon font sits on a different baseline than the text font. This line mixes a few with text so you can see the result on this page:  󰉋  .

## Finding a glyph without reading the whole sheet

Lookup is deliberately a small window. The agent runs `grep -i 'folder' data/glyphs.tsv` or `awk -F'\t' '$1=="md-folder"' data/glyphs.tsv` against the snapshot, so the TSV is never dumped into context. Three reference files sit next to it. `references/common-icons.md` is a short list by purpose, backed by `data/common-icons.txt`. `references/icon-concepts.md` has twenty-two concepts, each in five sets (md, fa, oct, cod, seti), for when a surface must stay in one set. `references/glyph-sets.md` covers prefixes and ranges, plus extra language escapes.

The names also carry history that a lookup has to respect. Material Design Icons moved in v3 from `nf-mdi-*` (U+F001 to U+F847) to `nf-md-*` (U+F0001 to U+F1AF0). Some names were dropped on the way, so a removed `nf-mdi-altimeter` is searched as the bare word `altimeter` on the cheat sheet. The folder you want now is 󰉋 `nf-md-folder` U+F024B. Powerline names lie about direction.  `nf-pl-left_hard_divider` U+E0B0 points right, while  `nf-pl-right_hard_divider` U+E0B2 points left, because the names describe the side of the cell the triangle sits on.

The install step has a naming rule too. Homebrew casks are `font-<kebab-patched-name>-nerd-font`, so `brew install --cask font-jetbrains-mono-nerd-font` is the JetBrains one. Dropping `--cask` or the hyphens asks for a formula that does not exist. The font is installed on the machine that runs the terminal, which means the remote host does not need it over ssh. kitty's family string is `font_family JetBrainsMono Nerd Font`.

The verification line prints three named glyphs:

```bash
printf '  󰉋\n'
```

From left to right, that is  `nf-custom-vim` U+E62B,  `nf-oct-mark_github` U+F408, and 󰉋 `nf-md-folder` U+F024B. `fc-list` is missing on stock macOS, so the skill uses `brew install fontconfig`, or `kitty +list-fonts`, or the `printf` alone.

## Reviewing an existing config

The same rules apply when the agent reads a file somebody else wrote. Review mode is `/nerd-fonts <file>` against a script, a TUI source, a prompt config, an editor or terminal config, HTML, or CSS. For each finding it quotes the line and says why in one sentence. Then it gives the fix: the exact glyph with `nf-<set>-<name>` and `U+XXXX`, or the exact config line.

The checklist behind it uses `perl` (it ships on macOS and Linux) to find emoji and dingbats. `grep -n 'nf-mdi-'` catches leftover Material classes, while a PUA scan finds glyphs without their name and codepoint. A family-name scan catches unpatched faces (Cascadia Code, Source Code Pro, IBM Plex Mono, and the rest of that list). `grep -L` finds HTML or CSS that uses glyphs but loads neither `webfont.css` nor `@font-face`.

Text markers in status lines (`E:`, `W:`, `[x]`, `->`) have no reliable regex, so the agent has to read the file. A deploy line that printed `ok` / `warning` / `error` should come back with something like 󰄬 `nf-md-check` U+F012C, 󰀨 `nf-md-alert_circle` U+F0028, and 󰅙 `nf-md-close_circle` U+F0159. All three come from one set, with comments from the TSV.

## Five scenarios as tests

I test whether the agent actually does all of this with five scenarios in `evals/evals.json`. They are written as assertions against `data/glyphs.tsv` and do not run as CI that launches a model. The first is a macOS user on kitty and starship whose prompt icons are empty boxes. The skill has to link font-downloads, name the cask `font-jetbrains-mono-nerd-font`, and give the family `JetBrainsMono Nerd Font` with `font_family JetBrainsMono Nerd Font` in kitty.conf. It must also print a `printf` of named glyphs from the TSV and mention Mono when columns must line up. The answer also has to point at the starship nerd-font-symbols preset without inventing a codepoint.

The second scenario tests the lookup rules directly. It asks for the glyph, hex, and class of five icons: the Octicons GitHub mark, the Font Awesome heart, the Devicons rust glyph, the Material Design folder, and the Powerline right-pointing solid separator. It also asks what happened to `nf-mdi-folder`. The gold answer is  `nf-oct-mark_github` U+F408,  `nf-fa-heart` U+F004,  `nf-dev-rust` U+E7A8, 󰉋 `nf-md-folder` U+F024B, and  `nf-pl-left_hard_divider` U+E0B0 (not  `right_hard_divider`). It has to explain the mdi-to-md move with bare names, without telling anyone to pin Nerd Fonts v2.

The third scenario is Ubuntu 24.04 with Neovim and nvim-tree in a GNOME Terminal that shows tofu, for a user who wants to keep the text font. It expects Symbols Only, `10-nerd-font-symbols.conf`, `fc-cache`, and `printf`, with no replacement of the text face. The fourth is a `deploy-status.sh` that prints a git branch and five services with ok, warning, error, pending, or unknown. Here the expectations are named glyphs with comments from the TSV, one set per surface, no emoji, and `--no-icons` or `NO_ICONS=1`. The answer also needs a font-downloads note, Mono or a caveat about columns, and `printf` rather than `echo`.

The fifth scenario reviews three files: a `starship.toml` full of emoji, a lualine snippet with `E:` / `W:` and `nf-mdi-folder`, and a `kitty.conf` that still says `font_family Cascadia Code`. Each finding has to quote the line. In the kitty finding, Cascadia becomes CaskaydiaCove, with the cask `font-caskaydia-cove-nerd-font`. Replacement glyphs come from the TSV, with no invented nvim-web-devicons APIs.

## Keeping up with upstream

Because the skill works from a snapshot, the repository has to notice when upstream moves. A clone-only Rust helper, `tools/nfskill`, validates every glyph name and codepoint in this repository against the snapshot. It does not ship inside the skill directory, so the skill itself stays `grep` and `awk`. Weekly CI watches upstream, so a new Nerd Fonts release, or a Homebrew cask that stops resolving, opens an issue. When upstream ships, the update is to regenerate `glyphs.tsv`, recompute glyph-sets and fonts, update the tag in `SKILL.md`, write the changelog, and then run `cargo run --manifest-path tools/nfskill/Cargo.toml -- validate`.

Install it with the skills CLI:

```bash
npx skills add massimodeluisa/nerdfonts-skill
```

The skill is listed at [skills.sh/massimodeluisa/nerdfonts-skill](https://skills.sh/massimodeluisa/nerdfonts-skill). Adding `-g` to that command makes it a user-level install. After that, `/nerd-fonts` applies the policy to the conversation, while `/nerd-fonts ~/.config/starship.toml` reviews that file. Font downloads stay on [nerdfonts.com/font-downloads](https://www.nerdfonts.com/font-downloads); the cheat sheet stays on [nerdfonts.com/cheat-sheet](https://www.nerdfonts.com/cheat-sheet). If a class in the snapshot is wrong, [edit it on GitHub](https://github.com/massimodeluisa/nerdfonts-skill).
