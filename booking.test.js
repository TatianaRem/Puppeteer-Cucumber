const puppeteer = require("puppeteer");

let browser;
let page;

beforeEach(async () => {
	browser = await puppeteer.launch();
	page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);
});

afterEach(async () => {
	await browser.close();
});

const fillBookingForm = async (page, movieTimeSelector, movieDateSelector) => {
	//Выбор даты
	await page.click(movieDateSelector);

	//Выбор времени начала фильма
	await page.click(movieTimeSelector);

	//Ожидание загрузки страницы
	await page.waitForNavigation();
};

describe("Booking cinema tickets", () => {
	beforeEach(async () => {
		await page.goto("http://qamid.tmweb.ru/client/index.php");
	}, 15000);
	const movieDateSelector = `[data-time-stamp="1693256400"]`;
	const movieTimeSelector = `[data-seance-id="176"]`;

	test("Happy path booking the first", async () => {
		await fillBookingForm(page, movieTimeSelector, movieDateSelector);
		const seatSelector = "div:nth-child(6) span:nth-child(5)"; //Выбор места
		await page.click(seatSelector);
		const buttonSelector = "button";
		await page.waitForSelector(buttonSelector, {
			visible: true,
		});
		const actual = await page.$eval(buttonSelector, (link) => link.textContent);
		expect(actual).toContain("Забронировать");
	}, 15000);

	test("Sad path booking", async () => {
		await fillBookingForm(page, movieTimeSelector, movieDateSelector);
		const seatSelector = "div :nth-child(2) span:nth-child(6)"; //Выбор места
		await page.click(seatSelector);
		const greyButtonSelector = "button";
		await page.waitForSelector(greyButtonSelector, {
			visible: false,
		});
		const actual = await page.$eval(
			greyButtonSelector,
			(link) => link.textContent
		);
		expect(actual).toContain("Забронировать");
	}, 15000);

	describe("Booking another cinema tickets", () => {
		const movieDateSelector = `[data-time-stamp="1692997200"]`;
		const movieTimeSelector = `[data-seance-id="173"]`;

		test("Happy path booking the second", async () => {
			await fillBookingForm(page, movieTimeSelector, movieDateSelector);
			const seatSelector = "div:nth-child(3) span:nth-child(1)"; //Выбор места
			await page.click(seatSelector);
			const buttonSelector = "button";
			await page.waitForSelector(buttonSelector, {
				visible: true,
			});
			const actual = await page.$eval(
				buttonSelector,
				(link) => link.textContent
			);
			expect(actual).toContain("Забронировать");
		}, 15000);
	});
});