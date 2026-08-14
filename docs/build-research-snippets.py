# Converts the rough research HTML in Igniton-New-Shopify/docs into brand-classed
# Liquid snippets for the live theme. Regenerable: rerun after the docs change.
import io, os, re, html

SRC = r'C:\Projects\Igniton-New-Shopify\docs'
OUT = r'C:\Projects\Shopify-Igniton-Download\snippets'

FILES = [
    ('ignicognition-research.html',        'ignicognition'),
    ('ignilongevity-research.html',        'ignilongevity'),
    ('ignirem-sleep-research.html',        'ignirem-sleep'),
    ('ignipeptide-eye-serum-research.html','ignipeptide-eye-serum'),
]

def inner(tag, s, cls=None):
    pat = r'<%s%s[^>]*>(.*?)</%s>' % (tag, r'[^>]*class="%s"' % cls if cls else '', tag)
    m = re.search(pat, s, re.S)
    return m.group(1).strip() if m else ''

def all_of(tag, s, cls):
    return [m.strip() for m in re.findall(r'<%s[^>]*class="%s"[^>]*>(.*?)</%s>' % (tag, cls, tag), s, re.S)]

def cell(row, label):
    m = re.search(r'<td data-label="%s">(.*?)</td>' % re.escape(label), row, re.S)
    return m.group(1).strip() if m else ''

def wordmark(t):
    """Igni* products render the prefix in gold, the way the nav does."""
    return re.sub(r'<em>Igni</em>', '<span class="ig-research__mark">Igni</span>', t)

for fname, slug in FILES:
    src = io.open(os.path.join(SRC, fname), encoding='utf-8').read()
    product = re.search(r'data-product="([^"]+)"', src).group(1)
    heading = wordmark(inner('h2', src))
    intro   = inner('p', src, 'igniton-research__intro')
    disc    = inner('p', src, 'igniton-research__disclaimer')

    out = []
    out.append('{%% comment %%}\n'
               '  Igniton — %s ingredient research\n'
               '  ------------------------------------------------------------\n'
               '  GENERATED from docs/%s in the Igniton-New-Shopify repo.\n'
               '  Do not hand-edit: change the source file and regenerate, or the\n'
               '  next regeneration silently reverts you.\n\n'
               '  Rendered by the research_table block in sections/ig-dashboard.liquid,\n'
               '  which places it between a tab\'s stat cards and its timeline.\n'
               '  Styling lives in assets/component-ig-dashboard.css.\n'
               '{%% endcomment %%}\n' % (product, fname))
    out.append('<div class="ig-research" data-product="%s">' % html.escape(product))
    out.append('  <div class="ig-research__head">')
    out.append('    <h3 class="ig-research__title">%s</h3>' % heading)
    if intro:
        out.append('    <p class="ig-research__intro">%s</p>' % intro)
    out.append('  </div>')

    blocks = re.findall(r'<section class="igniton-research__ingredient"[^>]*id="([^"]*)"[^>]*>(.*?)</section>', src, re.S)
    for anchor, body in blocks:
        name   = inner('h3', body)
        note   = inner('p', body, 'igniton-research__note')
        search = re.search(r'<p class="igniton-research__search">\s*<a href="([^"]+)"[^>]*>(.*?)</a>', body, re.S)
        empty  = inner('p', body, 'igniton-research__empty')
        rows   = re.findall(r'<tr>(.*?)</tr>', body, re.S)
        rows   = [r for r in rows if 'data-label' in r]

        out.append('\n  <section class="ig-research__group" id="%s">' % anchor)
        out.append('    <h4 class="ig-research__ingredient">%s</h4>' % name)
        if note:
            out.append('    <p class="ig-research__note">%s</p>' % note)

        if rows:
            out.append('    <div class="ig-research__scroll" role="region" aria-label="Published studies for %s" tabindex="0">'
                       % html.escape(re.sub(r'<[^>]+>', '', name)))
            out.append('      <table class="ig-research__table">')
            out.append('        <thead><tr>'
                       '<th scope="col">Published study</th>'
                       '<th scope="col">Journal</th>'
                       '<th scope="col">Year</th>'
                       '<th scope="col">Relevance</th>'
                       '</tr></thead>')
            out.append('        <tbody>')
            for r in rows:
                title = cell(r, 'Published Study')
                jour  = cell(r, 'Journal')
                year  = cell(r, 'Year')
                snote = cell(r, 'Study Note')
                link  = re.search(r'href="([^"]+)"', cell(r, 'Study Link'))
                url   = link.group(1) if link else ''
                # The study link becomes the title. A column holding nothing but
                # "View study" on every row spent width to say the same thing 27
                # times, and the title is the honest thing to click.
                lead = ('<a class="ig-research__link" href="%s" target="_blank" rel="noopener noreferrer">%s'
                        '<span class="ig-research__ext" aria-hidden="true">&#8599;</span></a>' % (url, title)) if url else title
                out.append('          <tr>')
                out.append('            <td data-label="Study">%s%s</td>' % (
                    lead,
                    '<span class="ig-research__srcmeta">%s%s</span>' % (
                        jour, ' &middot; %s' % year if year else '') if (jour or year) else ''))
                out.append('            <td data-label="Journal">%s</td>' % jour)
                out.append('            <td data-label="Year">%s</td>' % year)
                out.append('            <td data-label="Relevance">%s</td>' % snote)
                out.append('          </tr>')
            out.append('        </tbody>')
            out.append('      </table>')
            out.append('    </div>')

        if empty:
            out.append('    <p class="ig-research__empty">%s</p>' % empty)
        if search:
            out.append('    <p class="ig-research__search"><a href="%s" target="_blank" rel="noopener noreferrer">%s'
                       '<span class="ig-research__ext" aria-hidden="true">&#8599;</span></a></p>'
                       % (search.group(1), search.group(2).strip()))
        out.append('  </section>')

    if disc:
        out.append('\n  <p class="ig-research__disclaimer">%s</p>' % disc)
    out.append('</div>\n')

    path = os.path.join(OUT, 'ig-research-%s.liquid' % slug)
    io.open(path, 'w', encoding='utf-8', newline='\n').write('\n'.join(out))
    print('%-30s -> %-34s %2d groups, %2d studies' % (fname, os.path.basename(path), len(blocks), len(re.findall(r'data-label="Study"', '\n'.join(out)))))
