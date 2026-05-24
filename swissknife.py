#!/usr/bin/env python3
"""
Swiss Army Knife CLI - 100 Features
Usage: python swissknife.py <feature> [args...]
       python swissknife.py --list
"""

import sys
import os
import re
import math
import time
import random
import string
import hashlib
import base64
import json
import csv
import uuid
import datetime
import calendar
import urllib.parse
import textwrap
import struct
import socket
import colorsys
import io
import argparse

# ─────────────────────────────────────────
# 1-15  TEXT TOOLS
# ─────────────────────────────────────────

def reverse(text):
    """Reverse a string."""
    return text[::-1]

def palindrome(text):
    """Check if a string is a palindrome."""
    clean = re.sub(r'[^a-z0-9]', '', text.lower())
    return f"'{text}' is {'a palindrome' if clean == clean[::-1] else 'NOT a palindrome'}"

def word_count(text):
    """Count words in text."""
    words = text.split()
    return f"{len(words)} words"

def char_count(text):
    """Count characters (with and without spaces)."""
    return f"{len(text)} chars total, {len(text.replace(' ',''))} without spaces"

def caesar(text, shift=13):
    """Caesar cipher with given shift (default 13)."""
    shift = int(shift) % 26
    result = []
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            result.append(chr((ord(c) - base + shift) % 26 + base))
        else:
            result.append(c)
    return ''.join(result)

def rot13(text):
    """ROT13 encode/decode."""
    return caesar(text, 13)

def upper(text):
    """Convert to UPPERCASE."""
    return text.upper()

def lower(text):
    """Convert to lowercase."""
    return text.lower()

def title(text):
    """Convert to Title Case."""
    return text.title()

def snake_case(text):
    """Convert to snake_case."""
    s = re.sub(r'[\s\-]+', '_', text)
    s = re.sub(r'([A-Z])', r'_\1', s).lower().strip('_')
    return re.sub(r'_+', '_', s)

def camel_case(text):
    """Convert to camelCase."""
    words = re.split(r'[\s_\-]+', text)
    return words[0].lower() + ''.join(w.title() for w in words[1:])

def kebab_case(text):
    """Convert to kebab-case."""
    return snake_case(text).replace('_', '-')

def truncate(text, length=50):
    """Truncate text to given length."""
    length = int(length)
    return text[:length] + ('...' if len(text) > length else '')

def wrap(text, width=40):
    """Word-wrap text at given width."""
    return textwrap.fill(text, int(width))

def center(text, width=40):
    """Center text in given width."""
    return text.center(int(width))

# ─────────────────────────────────────────
# 16-30  MATH TOOLS
# ─────────────────────────────────────────

def add(*nums):
    """Add numbers together."""
    return str(sum(float(n) for n in nums))

def multiply(*nums):
    """Multiply numbers together."""
    result = 1
    for n in nums:
        result *= float(n)
    return str(result)

def factorial(n):
    """Calculate factorial of n."""
    n = int(n)
    if n < 0: return "Undefined for negative numbers"
    return str(math.factorial(n))

def fibonacci(n):
    """Generate first n Fibonacci numbers."""
    n = int(n)
    a, b = 0, 1
    seq = []
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return ' '.join(map(str, seq))

def is_prime(n):
    """Check if n is prime."""
    n = int(n)
    if n < 2: return f"{n} is NOT prime"
    if n == 2: return f"{n} IS prime"
    if n % 2 == 0: return f"{n} is NOT prime"
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0: return f"{n} is NOT prime"
    return f"{n} IS prime"

def gcd(*nums):
    """Greatest common divisor."""
    result = int(nums[0])
    for n in nums[1:]:
        result = math.gcd(result, int(n))
    return str(result)

def lcm(*nums):
    """Least common multiple."""
    result = int(nums[0])
    for n in nums[1:]:
        result = result * int(n) // math.gcd(result, int(n))
    return str(result)

def sqrt(n):
    """Square root of n."""
    return str(math.sqrt(float(n)))

def power(base, exp):
    """base raised to the power of exp."""
    return str(float(base) ** float(exp))

def modulo(a, b):
    """a modulo b."""
    return str(int(a) % int(b))

def to_roman(n):
    """Convert integer to Roman numeral."""
    n = int(n)
    if not 1 <= n <= 3999: return "Out of range (1-3999)"
    vals = [(1000,'M'),(900,'CM'),(500,'D'),(400,'CD'),(100,'C'),(90,'XC'),
            (50,'L'),(40,'XL'),(10,'X'),(9,'IX'),(5,'V'),(4,'IV'),(1,'I')]
    result = ''
    for value, numeral in vals:
        while n >= value:
            result += numeral
            n -= value
    return result

def to_binary(n):
    """Convert integer to binary."""
    return bin(int(n))

def to_hex(n):
    """Convert integer to hexadecimal."""
    return hex(int(n))

def to_octal(n):
    """Convert integer to octal."""
    return oct(int(n))

def percent(part, total):
    """What percentage is part of total?"""
    return f"{float(part) / float(total) * 100:.2f}%"

# ─────────────────────────────────────────
# 31-40  DATE / TIME TOOLS
# ─────────────────────────────────────────

def now():
    """Current date and time."""
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def timestamp():
    """Current Unix timestamp."""
    return str(int(time.time()))

def date_diff(date1, date2):
    """Days between two dates (YYYY-MM-DD)."""
    d1 = datetime.date.fromisoformat(date1)
    d2 = datetime.date.fromisoformat(date2)
    return f"{abs((d2 - d1).days)} days"

def add_days(date, days):
    """Add days to a date (YYYY-MM-DD)."""
    d = datetime.date.fromisoformat(date)
    result = d + datetime.timedelta(days=int(days))
    return str(result)

def weekday(date):
    """Day of week for a date (YYYY-MM-DD)."""
    d = datetime.date.fromisoformat(date)
    return d.strftime("%A")

def is_leap(year):
    """Check if a year is a leap year."""
    y = int(year)
    return f"{y} {'IS' if calendar.isleap(y) else 'is NOT'} a leap year"

def countdown(target_date):
    """Days until a future date (YYYY-MM-DD)."""
    target = datetime.date.fromisoformat(target_date)
    today = datetime.date.today()
    delta = (target - today).days
    if delta < 0: return f"That was {-delta} days ago"
    return f"{delta} days until {target_date}"

def age(birthdate):
    """Calculate age from birthdate (YYYY-MM-DD)."""
    b = datetime.date.fromisoformat(birthdate)
    today = datetime.date.today()
    years = today.year - b.year - ((today.month, today.day) < (b.month, b.day))
    return f"{years} years old"

def format_date(date, fmt="%B %d, %Y"):
    """Format a date string (YYYY-MM-DD) with strftime format."""
    d = datetime.date.fromisoformat(date)
    return d.strftime(fmt)

def week_number(date):
    """ISO week number for a date (YYYY-MM-DD)."""
    d = datetime.date.fromisoformat(date)
    return f"Week {d.isocalendar()[1]} of {d.year}"

# ─────────────────────────────────────────
# 41-55  FUN & GAMES
# ─────────────────────────────────────────

def dice(sides=6, count=1):
    """Roll dice. dice [sides] [count]"""
    sides, count = int(sides), int(count)
    rolls = [random.randint(1, sides) for _ in range(count)]
    return f"Rolled {count}d{sides}: {rolls}  (total: {sum(rolls)})"

def coin():
    """Flip a coin."""
    return random.choice(["Heads", "Tails"])

def magic8():
    """Shake the Magic 8-Ball."""
    answers = [
        "It is certain.", "It is decidedly so.", "Without a doubt.",
        "Yes, definitely.", "You may rely on it.", "As I see it, yes.",
        "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.",
        "Reply hazy, try again.", "Ask again later.", "Better not tell you now.",
        "Cannot predict now.", "Concentrate and ask again.",
        "Don't count on it.", "My reply is no.", "My sources say no.",
        "Outlook not so good.", "Very doubtful."
    ]
    return random.choice(answers)

def fortune():
    """A random fortune cookie message."""
    fortunes = [
        "The best time to plant a tree was 20 years ago. The second best time is now.",
        "A journey of a thousand miles begins with a single step.",
        "You will find what you seek if you look hard enough.",
        "Today is a good day to try something new.",
        "The secret of getting ahead is getting started.",
        "You have the power to make your dreams come true.",
        "Adventure awaits those who dare to leave comfort behind.",
        "A smile is the shortest distance between two people.",
        "Hard work pays off — eventually.",
        "You are exactly where you need to be.",
    ]
    return random.choice(fortunes)

def joke():
    """A random programming/nerd joke."""
    jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
        "Why do Python programmers wear glasses? Because they can't C#.",
        "How many programmers does it take to change a light bulb? None — that's a hardware problem.",
        "There are only 10 types of people: those who understand binary and those who don't.",
        "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
        "A byte walks into a bar looking pale. The bartender asks: 'What's wrong?' 'Bit operation.'",
        "Why did the developer go broke? Because he used up all his cache.",
        "Debugging: being the detective in a crime movie where you are also the murderer.",
        "99 little bugs in the code. 99 little bugs. Take one down, patch it around. 127 little bugs in the code.",
    ]
    return random.choice(jokes)

def riddle():
    """A random riddle."""
    riddles = [
        ("I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", "An echo"),
        ("The more you take, the more you leave behind. What am I?", "Footsteps"),
        ("I have cities, but no houses live there. I have mountains, but no trees grow there. What am I?", "A map"),
        ("I'm always in front of you but can't be seen. What am I?", "The future"),
        ("What has keys but no locks, space but no room, and you can enter but can't go inside?", "A keyboard"),
        ("I have hands but can't clap. What am I?", "A clock"),
        ("The more you share me, the more you have of me. What am I?", "Knowledge"),
        ("What can fill a room but takes up no space?", "Light"),
    ]
    q, a = random.choice(riddles)
    return f"Riddle: {q}\n(Answer: {a})"

def gen_password(length=16):
    """Generate a secure random password."""
    length = int(length)
    chars = string.ascii_letters + string.digits + string.punctuation
    return ''.join(random.SystemRandom().choice(chars) for _ in range(length))

def gen_uuid():
    """Generate a random UUID."""
    return str(uuid.uuid4())

def shuffle(*items):
    """Shuffle a list of items."""
    lst = list(items)
    random.shuffle(lst)
    return ' '.join(lst)

def pick(*items):
    """Pick a random item from a list."""
    return random.choice(items)

def rps():
    """Play Rock Paper Scissors against the computer."""
    choices = ["Rock", "Paper", "Scissors"]
    computer = random.choice(choices)
    user = random.choice(choices)
    wins = {"Rock": "Scissors", "Paper": "Rock", "Scissors": "Paper"}
    if user == computer:
        result = "Tie"
    elif wins[user] == computer:
        result = "You win!"
    else:
        result = "Computer wins!"
    return f"You: {user}  |  Computer: {computer}  →  {result}"

def ascii_banner(text):
    """Create a simple ASCII banner."""
    line = '+' + '-' * (len(text) + 2) + '+'
    return f"{line}\n| {text} |\n{line}"

def lorem(sentences=3):
    """Generate Lorem Ipsum text."""
    words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split()
    result = []
    for _ in range(int(sentences)):
        n = random.randint(8, 18)
        sentence = ' '.join(random.choices(words, k=n))
        result.append(sentence.capitalize() + '.')
    return ' '.join(result)

def countdown_timer(seconds):
    """Count down from N seconds (prints each second)."""
    for i in range(int(seconds), 0, -1):
        print(f"\r{i:3d}...", end='', flush=True)
        time.sleep(1)
    print("\rDone!      ")
    return ""

# ─────────────────────────────────────────
# 56-65  DATA & ENCODING
# ─────────────────────────────────────────

def b64_encode(text):
    """Base64 encode a string."""
    return base64.b64encode(text.encode()).decode()

def b64_decode(text):
    """Base64 decode a string."""
    return base64.b64decode(text.encode()).decode()

def url_encode(text):
    """URL-encode a string."""
    return urllib.parse.quote(text)

def url_decode(text):
    """URL-decode a string."""
    return urllib.parse.unquote(text)

def md5(text):
    """MD5 hash of a string."""
    return hashlib.md5(text.encode()).hexdigest()

def sha1(text):
    """SHA-1 hash of a string."""
    return hashlib.sha1(text.encode()).hexdigest()

def sha256(text):
    """SHA-256 hash of a string."""
    return hashlib.sha256(text.encode()).hexdigest()

def json_format(text):
    """Pretty-print JSON."""
    return json.dumps(json.loads(text), indent=2)

def csv_to_json(text):
    """Convert CSV text to JSON."""
    reader = csv.DictReader(io.StringIO(text))
    return json.dumps(list(reader), indent=2)

def json_to_csv(text):
    """Convert JSON array to CSV."""
    data = json.loads(text)
    if not data: return ""
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    return output.getvalue()

# ─────────────────────────────────────────
# 66-75  TEXT / FILE PROCESSING
# ─────────────────────────────────────────

def sort_lines(text):
    """Sort lines alphabetically."""
    return '\n'.join(sorted(text.splitlines()))

def unique_lines(text):
    """Remove duplicate lines (preserve order)."""
    seen = set()
    result = []
    for line in text.splitlines():
        if line not in seen:
            seen.add(line)
            result.append(line)
    return '\n'.join(result)

def grep(pattern, text):
    """Find lines matching a pattern."""
    matches = [l for l in text.splitlines() if re.search(pattern, l)]
    return '\n'.join(matches) if matches else "(no matches)"

def head(text, n=10):
    """First N lines of text."""
    return '\n'.join(text.splitlines()[:int(n)])

def tail(text, n=10):
    """Last N lines of text."""
    return '\n'.join(text.splitlines()[-int(n):])

def word_freq(text):
    """Top 10 word frequencies."""
    words = re.findall(r'\b\w+\b', text.lower())
    freq = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1
    top = sorted(freq.items(), key=lambda x: -x[1])[:10]
    return '\n'.join(f"{w:20s} {c}" for w, c in top)

def find_replace(text, find, replace):
    """Find and replace in text."""
    return text.replace(find, replace)

def line_count(text):
    """Count lines in text."""
    return f"{len(text.splitlines())} lines"

def number_lines(text):
    """Add line numbers to text."""
    return '\n'.join(f"{i+1:4d}  {l}" for i, l in enumerate(text.splitlines()))

def dedent(text):
    """Remove common leading whitespace."""
    return textwrap.dedent(text)

# ─────────────────────────────────────────
# 76-85  VISUAL & FORMATTING
# ─────────────────────────────────────────

def box(text):
    """Draw a box around text (multi-line safe)."""
    lines = text.splitlines()
    width = max(len(l) for l in lines)
    top = '┌' + '─' * (width + 2) + '┐'
    bot = '└' + '─' * (width + 2) + '┘'
    mid = [f'│ {l.ljust(width)} │' for l in lines]
    return '\n'.join([top] + mid + [bot])

def table(text):
    """Format CSV-style text as a pretty table."""
    rows = [row.split(',') for row in text.strip().splitlines()]
    widths = [max(len(r[i]) for r in rows) for i in range(len(rows[0]))]
    sep = '+' + '+'.join('-' * (w + 2) for w in widths) + '+'
    lines = [sep]
    for idx, row in enumerate(rows):
        line = '|' + '|'.join(f' {row[i].strip().ljust(widths[i])} ' for i in range(len(widths))) + '|'
        lines.append(line)
        if idx == 0:
            lines.append(sep)
    lines.append(sep)
    return '\n'.join(lines)

def progress_bar(percent_val, width=40):
    """Render a progress bar. progress_bar <0-100> [width]"""
    p = float(percent_val) / 100
    filled = int(p * int(width))
    bar = '█' * filled + '░' * (int(width) - filled)
    return f"[{bar}] {float(percent_val):.1f}%"

def star_rating(score, max_score=5):
    """Display a star rating. star_rating <score> [max]"""
    score = float(score)
    max_score = int(max_score)
    full = int(score)
    half = 1 if (score - full) >= 0.5 else 0
    empty = max_score - full - half
    return '★' * full + '½' * half + '☆' * empty + f'  {score}/{max_score}'

def show_calendar(year=None, month=None):
    """Show a text calendar for given month/year."""
    now_dt = datetime.date.today()
    y = int(year) if year else now_dt.year
    m = int(month) if month else now_dt.month
    return calendar.month(y, m)

def rgb_to_hex(r, g, b):
    """Convert RGB to hex color."""
    return f"#{int(r):02X}{int(g):02X}{int(b):02X}"

def hex_to_rgb(hex_color):
    """Convert hex color to RGB."""
    h = hex_color.lstrip('#')
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"rgb({r}, {g}, {b})"

def color_swatch(hex_color):
    """Display an ANSI color swatch for a hex color."""
    h = hex_color.lstrip('#')
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return f"\033[48;2;{r};{g};{b}m    \033[0m  #{h.upper()}  rgb({r},{g},{b})"

def gradient_text(text):
    """Display text in a rainbow gradient using ANSI colors."""
    colors = [(255,0,0),(255,127,0),(255,255,0),(0,255,0),(0,0,255),(139,0,255)]
    n = len(text)
    out = ''
    for i, ch in enumerate(text):
        idx = (i / max(n - 1, 1)) * (len(colors) - 1)
        lo = int(idx); hi = min(lo + 1, len(colors) - 1)
        t = idx - lo
        r = int(colors[lo][0] * (1-t) + colors[hi][0] * t)
        g = int(colors[lo][1] * (1-t) + colors[hi][1] * t)
        b_val = int(colors[lo][2] * (1-t) + colors[hi][2] * t)
        out += f"\033[38;2;{r};{g};{b_val}m{ch}"
    return out + '\033[0m'

# ─────────────────────────────────────────
# 86-90  NETWORK / URL TOOLS
# ─────────────────────────────────────────

def parse_url(url):
    """Parse and decompose a URL."""
    p = urllib.parse.urlparse(url)
    parts = {
        'scheme': p.scheme, 'netloc': p.netloc, 'path': p.path,
        'params': p.params, 'query': p.query, 'fragment': p.fragment
    }
    return '\n'.join(f"{k:10s}: {v}" for k, v in parts.items() if v)

def build_url(scheme, host, path='', query=''):
    """Build a URL from components."""
    return urllib.parse.urlunparse((scheme, host, path, '', query, ''))

def extract_domain(url):
    """Extract domain from a URL."""
    return urllib.parse.urlparse(url).netloc

def query_params(url):
    """Parse query string parameters from URL."""
    params = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    return '\n'.join(f"{k}: {v}" for k, v in params.items())

def ping_host(host):
    """Check if host resolves (DNS lookup)."""
    try:
        ip = socket.gethostbyname(host)
        return f"{host} → {ip}"
    except socket.gaierror as e:
        return f"Could not resolve {host}: {e}"

# ─────────────────────────────────────────
# 91-100  MISC & CONVERTERS
# ─────────────────────────────────────────

def morse(text):
    """Convert text to Morse code."""
    CODE = {
        'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....',
        'I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.',
        'Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-',
        'Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
        '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.':'.-.-.-',',':'--..--',
        '?':'..--..','!':'-.-.--',' ':'/'
    }
    return ' '.join(CODE.get(c.upper(), '?') for c in text)

def pig_latin(text):
    """Convert text to Pig Latin."""
    def convert(word):
        vowels = 'aeiouAEIOU'
        if word[0] in vowels:
            return word + 'way'
        i = next((i for i, c in enumerate(word) if c in vowels), len(word))
        return word[i:] + word[:i] + 'ay'
    return ' '.join(convert(w) for w in text.split())

def nato(text):
    """Convert text to NATO phonetic alphabet."""
    NATO = {
        'A':'Alpha','B':'Bravo','C':'Charlie','D':'Delta','E':'Echo','F':'Foxtrot',
        'G':'Golf','H':'Hotel','I':'India','J':'Juliet','K':'Kilo','L':'Lima',
        'M':'Mike','N':'November','O':'Oscar','P':'Papa','Q':'Quebec','R':'Romeo',
        'S':'Sierra','T':'Tango','U':'Uniform','V':'Victor','W':'Whiskey',
        'X':'X-ray','Y':'Yankee','Z':'Zulu',' ':'[space]'
    }
    return ' '.join(NATO.get(c.upper(), c) for c in text)

def celsius_to_f(c):
    """Convert Celsius to Fahrenheit."""
    return f"{float(c)}°C = {float(c)*9/5+32:.2f}°F"

def fahrenheit_to_c(f):
    """Convert Fahrenheit to Celsius."""
    return f"{float(f)}°F = {(float(f)-32)*5/9:.2f}°C"

def km_to_miles(km):
    """Convert kilometers to miles."""
    return f"{float(km)} km = {float(km) * 0.621371:.4f} miles"

def miles_to_km(miles):
    """Convert miles to kilometers."""
    return f"{float(miles)} miles = {float(miles) * 1.60934:.4f} km"

def kg_to_lbs(kg):
    """Convert kilograms to pounds."""
    return f"{float(kg)} kg = {float(kg) * 2.20462:.4f} lbs"

def lbs_to_kg(lbs):
    """Convert pounds to kilograms."""
    return f"{float(lbs)} lbs = {float(lbs) * 0.453592:.4f} kg"

def bmi(weight_kg, height_m):
    """Calculate BMI."""
    bmi_val = float(weight_kg) / (float(height_m) ** 2)
    if bmi_val < 18.5: cat = "Underweight"
    elif bmi_val < 25: cat = "Normal weight"
    elif bmi_val < 30: cat = "Overweight"
    else: cat = "Obese"
    return f"BMI = {bmi_val:.2f} ({cat})"

def anagram(text):
    """Check if two comma-separated words are anagrams."""
    parts = [p.strip() for p in text.split(',')]
    if len(parts) != 2: return "Provide two words separated by comma"
    a, b = sorted(parts[0].lower()), sorted(parts[1].lower())
    return f"'{parts[0]}' and '{parts[1]}' ARE{'NOT ' if a != b else ' '}anagrams"

# ─────────────────────────────────────────
# FEATURE REGISTRY
# ─────────────────────────────────────────

FEATURES = [
    # (number, name, function, description)
    (1,  "reverse",        reverse,        "Reverse a string"),
    (2,  "palindrome",     palindrome,     "Check if string is a palindrome"),
    (3,  "word-count",     word_count,     "Count words in text"),
    (4,  "char-count",     char_count,     "Count characters"),
    (5,  "caesar",         caesar,         "Caesar cipher [text] [shift=13]"),
    (6,  "rot13",          rot13,          "ROT13 encode/decode"),
    (7,  "upper",          upper,          "Convert to UPPERCASE"),
    (8,  "lower",          lower,          "Convert to lowercase"),
    (9,  "title",          title,          "Convert to Title Case"),
    (10, "snake-case",     snake_case,     "Convert to snake_case"),
    (11, "camel-case",     camel_case,     "Convert to camelCase"),
    (12, "kebab-case",     kebab_case,     "Convert to kebab-case"),
    (13, "truncate",       truncate,       "Truncate text [text] [length=50]"),
    (14, "wrap",           wrap,           "Word-wrap text [text] [width=40]"),
    (15, "center",         center,         "Center text [text] [width=40]"),
    (16, "add",            add,            "Add numbers"),
    (17, "multiply",       multiply,       "Multiply numbers"),
    (18, "factorial",      factorial,      "Calculate factorial"),
    (19, "fibonacci",      fibonacci,      "First N Fibonacci numbers"),
    (20, "is-prime",       is_prime,       "Check if number is prime"),
    (21, "gcd",            gcd,            "Greatest common divisor"),
    (22, "lcm",            lcm,            "Least common multiple"),
    (23, "sqrt",           sqrt,           "Square root"),
    (24, "power",          power,          "Raise base to power [base] [exp]"),
    (25, "modulo",         modulo,         "a modulo b"),
    (26, "to-roman",       to_roman,       "Convert to Roman numerals"),
    (27, "to-binary",      to_binary,      "Convert to binary"),
    (28, "to-hex",         to_hex,         "Convert to hexadecimal"),
    (29, "to-octal",       to_octal,       "Convert to octal"),
    (30, "percent",        percent,        "Percentage: [part] [total]"),
    (31, "now",            now,            "Current date and time"),
    (32, "timestamp",      timestamp,      "Current Unix timestamp"),
    (33, "date-diff",      date_diff,      "Days between dates [YYYY-MM-DD] [YYYY-MM-DD]"),
    (34, "add-days",       add_days,       "Add days to date [YYYY-MM-DD] [days]"),
    (35, "weekday",        weekday,        "Day of week for date [YYYY-MM-DD]"),
    (36, "is-leap",        is_leap,        "Check if leap year"),
    (37, "countdown",      countdown,      "Days until a date [YYYY-MM-DD]"),
    (38, "age",            age,            "Calculate age from birthdate [YYYY-MM-DD]"),
    (39, "format-date",    format_date,    "Format date [YYYY-MM-DD] [format]"),
    (40, "week-number",    week_number,    "ISO week number for date [YYYY-MM-DD]"),
    (41, "dice",           dice,           "Roll dice [sides=6] [count=1]"),
    (42, "coin",           coin,           "Flip a coin"),
    (43, "magic8",         magic8,         "Ask the Magic 8-Ball"),
    (44, "fortune",        fortune,        "Get a fortune cookie message"),
    (45, "joke",           joke,           "Get a random joke"),
    (46, "riddle",         riddle,         "Get a random riddle"),
    (47, "gen-password",   gen_password,   "Generate secure password [length=16]"),
    (48, "gen-uuid",       gen_uuid,       "Generate a UUID"),
    (49, "shuffle",        shuffle,        "Shuffle items [item1] [item2] ..."),
    (50, "pick",           pick,           "Pick random item [item1] [item2] ..."),
    (51, "rps",            rps,            "Play Rock Paper Scissors"),
    (52, "ascii-banner",   ascii_banner,   "ASCII banner around text"),
    (53, "lorem",          lorem,          "Generate Lorem Ipsum [sentences=3]"),
    (54, "countdown-timer",countdown_timer,"Countdown from N seconds"),
    (55, "anagram",        anagram,        "Check anagram [word1,word2]"),
    (56, "b64-encode",     b64_encode,     "Base64 encode"),
    (57, "b64-decode",     b64_decode,     "Base64 decode"),
    (58, "url-encode",     url_encode,     "URL-encode a string"),
    (59, "url-decode",     url_decode,     "URL-decode a string"),
    (60, "md5",            md5,            "MD5 hash"),
    (61, "sha1",           sha1,           "SHA-1 hash"),
    (62, "sha256",         sha256,         "SHA-256 hash"),
    (63, "json-format",    json_format,    "Pretty-print JSON"),
    (64, "csv-to-json",    csv_to_json,    "Convert CSV text to JSON"),
    (65, "json-to-csv",    json_to_csv,    "Convert JSON array to CSV"),
    (66, "sort-lines",     sort_lines,     "Sort lines alphabetically"),
    (67, "unique-lines",   unique_lines,   "Remove duplicate lines"),
    (68, "grep",           grep,           "Find lines matching pattern [pattern] [text]"),
    (69, "head",           head,           "First N lines [text] [n=10]"),
    (70, "tail",           tail,           "Last N lines [text] [n=10]"),
    (71, "word-freq",      word_freq,      "Top 10 word frequencies"),
    (72, "find-replace",   find_replace,   "Find and replace [text] [find] [replace]"),
    (73, "line-count",     line_count,     "Count lines"),
    (74, "number-lines",   number_lines,   "Add line numbers"),
    (75, "dedent",         dedent,         "Remove common leading whitespace"),
    (76, "box",            box,            "Draw a box around text"),
    (77, "table",          table,          "Format CSV-style text as table"),
    (78, "progress-bar",   progress_bar,   "Render a progress bar [0-100] [width=40]"),
    (79, "star-rating",    star_rating,    "Display star rating [score] [max=5]"),
    (80, "show-calendar",  show_calendar,  "Show calendar [year] [month]"),
    (81, "rgb-to-hex",     rgb_to_hex,     "RGB to hex [r] [g] [b]"),
    (82, "hex-to-rgb",     hex_to_rgb,     "Hex to RGB [#rrggbb]"),
    (83, "color-swatch",   color_swatch,   "Show ANSI color swatch [#rrggbb]"),
    (84, "gradient-text",  gradient_text,  "Rainbow gradient text"),
    (85, "parse-url",      parse_url,      "Parse and decompose a URL"),
    (86, "build-url",      build_url,      "Build URL [scheme] [host] [path] [query]"),
    (87, "extract-domain", extract_domain, "Extract domain from URL"),
    (88, "query-params",   query_params,   "Parse query parameters from URL"),
    (89, "ping-host",      ping_host,      "DNS lookup for host"),
    (90, "morse",          morse,          "Convert text to Morse code"),
    (91, "pig-latin",      pig_latin,      "Convert to Pig Latin"),
    (92, "nato",           nato,           "NATO phonetic alphabet"),
    (93, "celsius-to-f",   celsius_to_f,   "Celsius to Fahrenheit"),
    (94, "fahrenheit-to-c",fahrenheit_to_c,"Fahrenheit to Celsius"),
    (95, "km-to-miles",    km_to_miles,    "Kilometers to miles"),
    (96, "miles-to-km",    miles_to_km,    "Miles to kilometers"),
    (97, "kg-to-lbs",      kg_to_lbs,      "Kilograms to pounds"),
    (98, "lbs-to-kg",      lbs_to_kg,      "Pounds to kilograms"),
    (99, "bmi",            bmi,            "Calculate BMI [weight_kg] [height_m]"),
    (100,"word-wrap-box",
         lambda text, w="60": box(wrap(text, w)),
         "Word-wrap text then put it in a box [text] [width=60]"),
]

FEATURE_MAP = {f[1]: f for f in FEATURES}


def print_list():
    categories = [
        ("TEXT TOOLS",      range(1, 16)),
        ("MATH TOOLS",      range(16, 31)),
        ("DATE/TIME TOOLS", range(31, 41)),
        ("FUN & GAMES",     range(41, 56)),
        ("DATA & ENCODING", range(56, 66)),
        ("TEXT PROCESSING", range(66, 76)),
        ("VISUAL",          range(76, 86)),
        ("NETWORK/URL",     range(85, 90)),
        ("MISC/CONVERTERS", range(90, 101)),
    ]
    print()
    print("╔══════════════════════════════════════════════════════════════╗")
    print("║          SWISS ARMY KNIFE  —  100 FEATURES                  ║")
    print("╚══════════════════════════════════════════════════════════════╝")
    for cat_name, nums in categories:
        print(f"\n  ── {cat_name} ──")
        for feat in FEATURES:
            if feat[0] in nums:
                print(f"    {feat[0]:3d}. {feat[1]:<22s}  {feat[3]}")
    print()
    print("  Usage:  python swissknife.py <feature-name> [args...]")
    print("          python swissknife.py --list\n")


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ('--list', '-l', 'list'):
        print_list()
        return

    name = sys.argv[1].lower()
    args = sys.argv[2:]

    if name not in FEATURE_MAP:
        # Try fuzzy match
        close = [k for k in FEATURE_MAP if name in k]
        if close:
            print(f"Unknown feature '{name}'. Did you mean: {', '.join(close)}?")
        else:
            print(f"Unknown feature '{name}'. Run with --list to see all 100 features.")
        sys.exit(1)

    _, _, fn, _ = FEATURE_MAP[name]
    try:
        result = fn(*args)
        if result:
            print(result)
    except TypeError as e:
        print(f"Wrong number of arguments. Check --list for usage.")
        print(f"  ({e})")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
