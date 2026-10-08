import random
import copy


class Game:
    """
    מחלקת Game מייצגת משחק איקס-עיגול יחיד המתנהל על לוח בגודל 4x4.

    במשחק משתתפים שני שחקנים:
        Agent  - מיוצג על הלוח באמצעות 1
        Player - מיוצג על הלוח באמצעות -1
    מקום פנוי בלוח מיוצג באמצעות 0.
    (ייצוג זה נשמר באופן קבוע וזהה בכל התוכנית - ר' תא בלוח, check_win וכו')

    שני השחקנים בוחרים את מהלכם באופן אקראי מתוך המקומות הפנויים בלוח.
    מטרת המשחק: ליצור רצף של ארבעה סימנים זהים בשורה, בעמודה או באלכסון.

    ה-Agent הוא זה שמתחיל את המשחק (הוחלט כך כי זה הפתרון הפשוט יותר,
    ולא הושאר ליד המקרה - ר' play).

    המחלקה אחראית על: הלוח, המקומות הפנויים, ביצוע המהלכים, שמירת
    היסטוריית מצבי הלוח, זיהוי ניצחון וזיהוי סיום המשחק.
    """

    # תכונת מחלקה (לא תכונת מופע) - קבועה ומשותפת לכל משחק: גודל הלוח.
    SIZE = 4

    def __init__(self):
        """
        מאתחלת משחק חדש: יוצרת לוח ריק, רשימת מקומות פנויים, היסטוריה
        ריקה, ומאתחלת את מצב המשחק (winner, finished). לא מקבלת
        פרמטרים נוספים ולא מחזירה ערך.
        """

        # תכונת מופע: לוח 4x4 שכולו אפסים - כל התאים פנויים בתחילת המשחק.
        # רשימה דו-מימדית: self.board[row][col].
        self.board = [[0] * Game.SIZE for _ in range(Game.SIZE)]

        # תכונת מופע: כל הזוגות (row, col) האפשריים בלוח - בהתחלה כל 16
        # המשבצות פנויות. הרשימה מתעדכנת (יימחקו ממנה זוגות) לאחר כל מהלך.
        self.available_places = [
            (row, col)
            for row in range(Game.SIZE)
            for col in range(Game.SIZE)
        ]

        # תכונת מופע: רשימת מצבי לוח לאורך המשחק. תתמלא בעותקים עצמאיים
        # (deepcopy) של הלוח לאחר כל מהלך, ולא בהפניות אליו.
        self.history = []

        # תכונת מופע: תוצאת המשחק. None כל עוד לא הוכרעה תוצאה.
        # תקבל 1 אם ה-Agent ניצח, -1 אם ה-Player ניצח, 0 בתיקו.
        self.winner = None

        # תכונת מופע: האם המשחק הסתיים. False בתחילת המשחק.
        self.finished = False

        self.agent_win =1
        self.agent_lose = -1
        self.tie=0.1
        self.gama=0.9

        self.h_g=[]

        # תכונת מופע (סעיף 3): היסטוריית המשחק עם ניקוד, כשהלוח שמור
        # כמחרוזת באורך 16 (ולא כרשימה דו-מימדית).
        # כל איבר ברשימה הוא זוג (tuple): (מחרוזת_הלוח, ניקוד)
        # לדוגמה: ("1020000000000000", 0.81)
        # הרשימה ריקה בתחילת המשחק ומתמלאת ב-build_history_str בסוף המשחק.
        self.history_str = []

    # ------------------------------------------------------------------
    # המרות בין לוח למחרוזת
    #
    # ייצוג במחרוזת (רק במחרוזת!):
    #     מקום ריק (0)   -> '0'
    #     Agent    (1)   -> '1'
    #     Player   (-1)  -> '2'
    # הסיבה: "-1" תופס שני תווים, ואז המחרוזת לא הייתה באורך 16 קבוע.
    # בלוח עצמו ובשאר הקוד ה-Player נשאר -1 - לא משנים אותו!
    # ------------------------------------------------------------------

    # מילוני המרה קבועים (תכונות מחלקה) - משותפים לכל המשחקים.
    # CELL_TO_CHAR: מערך בלוח -> תו במחרוזת
    # CHAR_TO_CELL: תו במחרוזת -> ערך בלוח (ההמרה ההפוכה)
    CELL_TO_CHAR = {0: '0', 1: '1', -1: '2'}
    CHAR_TO_CELL = {'0': 0, '1': 1, '2': -1}

    def board_to_string(self, board=None):
        """
        (סעיף 1) ממירה לוח 4x4 למחרוזת באורך 16 תווים.
        פרמטר: board - לוח להמרה. אם לא נשלח, ממירה את הלוח הנוכחי
               (self.board).
        מחזירה: מחרוזת באורך 16. הלוח נקרא שורה אחרי שורה, משמאל לימין:
                תווים 0-3 = שורה 0, תווים 4-7 = שורה 1, וכן הלאה.
        לדוגמה: הלוח
            [ 1, 0, -1, 0]
            [ 0, 0,  0, 0]
            [ 0, 0,  0, 0]
            [ 0, 0,  0, 0]
        יומר ל: "1020000000000000"
        הפעולה לא משנה את הלוח.
        """
        if board is None:
            board = self.board

        # עוברים על כל תא (שורה אחרי שורה) וממירים אותו לתו המתאים,
        # ואז מחברים את כל התווים למחרוזת אחת.
        return ''.join(
            Game.CELL_TO_CHAR[board[row][col]]
            for row in range(Game.SIZE)
            for col in range(Game.SIZE)
        )

    def string_to_board(self, s):
        """
        (סעיף 2) ממירה מחרוזת באורך 16 תווים חזרה ללוח 4x4.
        פרמטר: s - מחרוזת באורך 16 המורכבת רק מהתווים '0', '1', '2'.
        מחזירה: לוח חדש (רשימה דו-מימדית) שבו '0' -> 0, '1' -> 1,
                '2' -> -1. כלומר בלוח המוחזר ה-Player שוב מיוצג כ-1-.
        הפעולה לא משנה את self.board - היא רק מחזירה לוח חדש.
        אם המחרוזת לא תקינה - נזרקת שגיאה ValueError.
        """
        # בדיקת תקינות: אורך נכון ורק תווים מותרים.
        if len(s) != Game.SIZE * Game.SIZE:
            raise ValueError("המחרוזת חייבת להיות באורך 16")
        for ch in s:
            if ch not in Game.CHAR_TO_CELL:
                raise ValueError("תו לא חוקי במחרוזת: " + ch)

        # התו במקום row*4+col במחרוזת הוא התא [row][col] בלוח.
        return [
            [Game.CHAR_TO_CELL[s[row * Game.SIZE + col]] for col in range(Game.SIZE)]
            for row in range(Game.SIZE)
        ]

    def agent_move(self):
        """
        מבצעת מהלך של ה-Agent: מגרילה מקום פנוי מתוך available_places
        ומציבה בו 1. אין פרמטרים.
        מחזירה: True אם בוצע מהלך, False אם המשחק כבר הסתיים.
        """
        if self.finished:
            # אם המשחק כבר נגמר - אין מה להזיז, לא נוגעים בלוח.
            return False

        # row, col הם משתנים מקומיים: משמשים רק לביצוע המהלך הנוכחי,
        # ולכן אינם נשמרים כתכונות (self.row / self.col).
        if self.best_move():
            return True
        if self.block_win():
            return True

        row, col = random.choice(self.available_places)

        self._make_move(row, col, 1)
        return True

    def player_move(self):
        """
        מבצעת מהלך של ה-Player: מגרילה מקום פנוי מתוך available_places
        ומציבה בו -1. אין פרמטרים.
        מחזירה: True אם בוצע מהלך, False אם המשחק כבר הסתיים.
        """
        if self.finished:
            return False

        row, col = random.choice(self.available_places)  # משתנים מקומיים בלבד

        self._make_move(row, col, -1)
        return True

    def _make_move(self, row, col, player):
        """
        מבצעת בפועל את המהלך שהוחלט עליו ב-agent_move / player_move.
        פרמטרים: row - שורה, col - עמודה, player - הערך שיוכנס ללוח (1 או -1).
        לא מחזירה ערך.

        מעדכנת את הלוח, מסירה את המקום מרשימת המקומות הפנויים, שומרת
        עותק של הלוח בהיסטוריה, ובודקת אם המשחק הסתיים (ניצחון או תיקו).
        """
        # 1. עדכון הלוח בערך של השחקן שהזיז (1 או -1).
        self.board[row][col] = player

        # 2. המקום שנתפס כבר לא פנוי - מוציאים אותו מהרשימה כדי שלא
        #    ייבחר שוב במהלך הבא.
        self.available_places.remove((row, col))

        # 3. שומרים ב-history עותק עצמאי (deepcopy) של הלוח, ולא הפניה
        #    אליו - אחרת שינויים עתידיים בלוח היו משנים גם מצבים ישנים
        #    שכבר "נשמרו" בהיסטוריה.
        self.history.append(copy.deepcopy(self.board))

        # 4. בדיקת סיום משחק: או שהשחקן שזה עתה זז ניצח, או שאזל המקום
        #    בלוח (תיקו).
        if self.check_win(player):
            self.finished = True
            self.winner = player
        elif not self.available_places:
            self.finished = True
            self.winner = 0

    def best_move(self):
        b = self.board
        n = Game.SIZE

        for row in range(n):
            for col in range(n):
                if b[row][col] == 0:
                    b[row][col] = 1
                    if self.check_win(1):
                        b[row][col] = 0
                        self._make_move(row, col,1)
                        #print(self.history)
                        return True
                    b[row][col] = 0
        return False

    def block_win(self):
        b = self.board
        n = Game.SIZE

        for row in range(n):
            for col in range(n):
                if b[row][col] == 0:
                    b[row][col] = -1
                    if self.check_win(-1):
                        b[row][col] = 0
                        self._make_move(row, col, 1)
                        #print(self.history)
                        return True
                    b[row][col] = 0
        return False

    def check_win(self, player):
        """
        בודקת האם קיימת רביעייה של player בשורה, בעמודה, או באחד משני
        האלכסונים. פרמטר: player - השחקן שעבורו נבדק ניצחון (1 או -1).
        מחזירה: True אם השחקן ניצח, אחרת False.
        """
        b = self.board
        n = Game.SIZE

        # בדיקת כל השורות: האם קיימת שורה שכל תאיה שייכים ל-player.
        for row in range(n):
            if all(b[row][col] == player for col in range(n)):
                return True

        # בדיקת כל העמודות: האם קיימת עמודה שכל תאיה שייכים ל-player.
        for col in range(n):
            if all(b[row][col] == player for row in range(n)):
                return True

        # בדיקת האלכסון הראשי: (0,0), (1,1), (2,2), (3,3).
        if all(b[i][i] == player for i in range(n)):
            return True

        # בדיקת האלכסון המשני: (0,3), (1,2), (2,1), (3,0).
        if all(b[i][n - 1 - i] == player for i in range(n)):
            return True

        # לא נמצא אף רצף מנצח.
        return False





    def play(self):
        """
        מנהלת משחק שלם מתחילתו ועד סופו. אין פרמטרים.
        ה-Agent מתחיל, ולאחר מכן ה-Agent וה-Player מבצעים מהלכים
        לסירוגין עד שהמשחק מסתיים.
        מחזירה: 1 אם ה-Agent ניצח, -1 אם ה-Player ניצח, 0 בתיקו.
        """
        while not self.finished:
            # Agent מתחיל תמיד את הסיבוב.
            self.agent_move()

            # אין צורך לבדוק כאן שוב את self.finished: player_move
            # עצמה בודקת זאת בתחילתה ולא תבצע מהלך אם המשחק כבר הסתיים
            # (אחרי ניצחון Agent או תיקו), ותחזיר False בלי לגעת בלוח.
            self.player_move()

        self.grade()
        print(self.h_g)

        # בניית ההיסטוריה עם הלוח כמחרוזת (סעיף 4).
        self.build_history_str()
        return self.winner



    def grade(self):
        # reversed() עוברת על ההיסטוריה מהסוף להתחלה בלי לשנות את
        # self.history עצמה (בשונה מ-reverse()), כדי שפעולות אחרות
        # (כמו build_history_str) יקבלו את ההיסטוריה בסדר המקורי.
        grade= self.winner
        if grade ==0:
             grade=0.1

        for i, board in enumerate(reversed(self.history)):
          self.h_g.append((board,grade))
          grade=grade*0.9
          print(self.h_g[i])

    def build_history_str(self):
        """
        (סעיף 4) בונה את self.history_str: היסטוריית המשחק שבה כל מצב לוח
        שמור כמחרוזת באורך 16 יחד עם הניקוד שלו.
        אין פרמטרים. יש לקרוא לה אחרי שהמשחק הסתיים (כשידוע winner).
        מחזירה: את הרשימה self.history_str.

        חישוב הניקוד (זהה ל-grade):
            * המצב האחרון במשחק מקבל את התוצאה:
                  1 (agent_win) אם ה-Agent ניצח,
                 -1 (agent_lose) אם ה-Player ניצח,
                  0.1 (tie) בתיקו.
            * כל מצב שלפניו מקבל את הניקוד של המצב שאחריו כפול 0.9 (gama).
              כך מצבים קרובים לסוף המשחק "אחראים" יותר לתוצאה.
        סדר הרשימה - כמו ב-h_g: מהמצב האחרון במשחק אל הראשון.
        """
        # מתחילים רשימה חדשה, כדי שקריאה כפולה לא תכפיל את הנתונים.
        self.history_str = []

        # הניקוד של המצב האחרון - לפי תוצאת המשחק.
        if self.winner == 1:
            score = self.agent_win
        elif self.winner == -1:
            score = self.agent_lose
        else:
            score = self.tie

        # עוברים מהסוף להתחלה. במקום לשמור את הלוח עצמו - שומרים את
        # המחרוזת שלו (board_to_string) יחד עם הניקוד.
        for board in reversed(self.history):
            self.history_str.append((self.board_to_string(board), score))
            score = score * self.gama

        return self.history_str




game = Game()
result = game.play()

print("Winner:", result)  # 1 = Agent ניצח, -1 = Player ניצח, 0 = תיקו
print("Board:")
for row in game.board:
    print(row)

# הדגמת ההמרות וההיסטוריה כמחרוזות
board_str = game.board_to_string()
print("Board as string:", board_str)
print("Back to board:", game.string_to_board(board_str))
print("History as strings:", game.history_str)



class Games:
    def __init__(self):
     self.pWin=0
     self.aWin=0
     self.tWin=0

    def playRun(self):
      for i in range(100000):
         saveGame = Game()
         result=saveGame.play()
         if result == 1:
             self.aWin+=1
         if result == -1:
            self.pWin += 1
         if result == 0:
             self.tWin+=1

      print("all:", self.pWin ,self.aWin, self.tWin)

      print("max", max(self.pWin ,self.aWin, self.tWin))


if __name__ == "__main__":
 games = Games()
 games.playRun()
