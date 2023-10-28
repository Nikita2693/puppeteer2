const {
    selectDateTime,
    orderTickets,
    checkSeatIsTaken,
  } = require("./lib/util.js");
  const { getText } = require("./lib/commands");
  
  let page;
  let tomorrow = "nav.page-nav > a:nth-child(2)";
  let oneWeek = "nav.page-nav > a:nth-child(7)"; 
  let movieTime = "[data-seance-id='178']"; 
  let ticketHint = "p.ticket__hint";
  let confirmingText =
    "Покажите QR-код нашему контроллеру для подтверждения бронирования.";
  
  describe("Service for Movie tickets order", () => {
    beforeEach(async () => {
      page = await browser.newPage();
      await page.goto("http://qamid.tmweb.ru/client/index.php");
      await page.setDefaultNavigationTimeout(0);
    });
  
    afterEach(() => {
      page.close();
    });
  
   test("Order a ticket for Movie-1 tomorrow", async () => {
   await selectDateTime(page, tomorrow, movieTime);
     await orderTickets(page, 2, 5);
      const actual = await getText(page, ticketHint);
      expect(actual).toContain(confirmingText);
   });
    test("Order a ticket for Movie-1 in a week", async () => {
        await selectDateTime(page, oneWeek, movieTime);
        await orderTickets(page, 4, 2,);
        const actual = await getText(page, ticketHint);
        expect(actual).toContain(confirmingText);
      });  
     test("Try to order ticket for Movie-1 if seat is already taken", async () => {
       await expect(async () => {
          await selectDateTime(page, tomorrow, movieTime);
          await orderTickets(page, 2, 5);
    }).rejects.toThrowError("Seat(s) is taken");
      });
  });