import { Stagehand } from '@browserbasehq/stagehand';

const BASE_URL = 'https://localhost:8443/hccg';
const LOGIN_URL = `${BASE_URL}/gt/login`;
const ADD_URL = `${BASE_URL}/gt/gt-app-communicate-expenses/add`;
const TO_BE_SIGNED_URL = `${BASE_URL}/gt/gt-app-form-to-be-signed`;
const PENDING_URL = `${BASE_URL}/gt/gt-app-form-pending`;
const UPLOAD_FILE = '/Users/ss105213025/ginmao/ERIS_project/eris/work-flow/src/main/resources/static/asset/gt/image/waterMark.png';
const FALLBACK_FILE = '/Users/ss105213025/ginmao/ERIS_project/eris/hccg-server/src/test/resources/district.txt';

const OFFICE_ID = '4dfa4aff-cd05-4296-88fe-c82abf0ee1a5';
const SECTION_ID = 'a514ce2c-1df8-45ff-81e5-85a8c0325810';
const APPLICANT_USER_ID = '28ba720c-6037-40e9-ba2e-8361f5d48cba';
const PERSONAL_PROCESS_ID = '9d9f0c0f-a8b4-47c7-81d0-610fa7fa33b6';
const GENERAL_PAYMENT_TYPE_ID = '86b48031-975f-46f2-8d47-a6b10232fcd3';
const ADVANCE_PAYMENT_TYPE_ID = '3c24a1ab-d3c8-4e4a-b217-f04cdcbde29a';

const REPORT_TYPE_DATA = '數據通訊費';
const REPORT_TYPE_GENERAL = '一般通訊費';
const DETAIL_MONTH = '115/03';
const DETAIL_PHONE = '0912345678';
const DETAIL_PHONE_RAW = '09A12-345678';
const INITIAL_AMOUNT = '123';
const UPDATED_AMOUNT = '456';
const EXPECTED_NOTE = '行政處115年03月數據通訊費0912345678共1筆';
const APPORTION_TRUE_SELECTOR =
  'input[type="radio"][name="main.isApportion"][value="true"], input[type="radio"][name="isApportion"][value="true"]';
const APPORTION_FALSE_SELECTOR =
  'input[type="radio"][name="main.isApportion"][value="false"], input[type="radio"][name="isApportion"][value="false"]';
const PAYEE_NAME_SELECTOR = '#cba-payee input#name';
const PAYEE_BANK_NO_SELECTOR = '#cba-payee input#bankNo';
const PAYEE_BANK_NAME_SELECTOR = '#cba-payee input#bankName';
const PAYEE_ACCOUNT_SELECTOR = '#cba-payee input#account';
const PAYEE_ACCOUNT_NAME_SELECTOR = '#cba-payee input#accountName';
const PAYEE_AMOUNT_SELECTOR = '#cba-payee input#amount';
const PAYEE_PAYMENT_TYPE_SELECTOR = '#cba-payee select#paymentType';
const CONTRACT_CHECKBOX_SELECTOR =
  'input[type="checkbox"][name="main.isContract"], input[type="checkbox"][name="isContract"]';
const PAYMENT_ATTACHES_CHECKBOX_SELECTOR =
  'input[type="checkbox"][name="main.isPaymentAttaches"], input[type="checkbox"][name="isPaymentAttaches"]';
const REGISTER_OBJECT_CHECKBOX_SELECTOR =
  'input[type="checkbox"][name="main.isRegisterObject"], input[type="checkbox"][name="isRegisterObject"]';
const PENDING_FORM_NO_SELECTOR =
  'input[name="queryContext.conditions[like-main.no]"], input[name="conditions[like-main.no]"]';

type ValidationResult = {
  formNo: string;
  draftUrl: string;
  firstApproverName: string;
  firstApproverDisplayName: string;
  firstApproverUserId: string;
  submittedPendingLink: string;
  checks: string[];
  persisted: Record<string, string>;
};

const headless = process.env.HEADLESS === '1';

function normalizeText(value: string | null | undefined): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function digitsOnly(value: string | null | undefined): string {
  return String(value ?? '').replace(/\D/g, '');
}

function resolveDisplayName(optionLabel: string): string {
  const beforeTitle = normalizeText(optionLabel).split(' - ')[0] ?? '';
  const segments = beforeTitle.split(' ').filter(Boolean);
  return segments.at(-1) ?? beforeTitle;
}

async function main() {
  const checks: string[] = [];
  let currentStep = 'init';
  const stagehand = new Stagehand({
    env: 'LOCAL',
    disableAPI: true,
    localBrowserLaunchOptions: {
      headless,
      ignoreHTTPSErrors: true,
      viewport: {
        width: 1600,
        height: 1200,
      },
    },
  });

  await stagehand.init();
  const page = stagehand.context.pages()[0] ?? await stagehand.context.newPage();

  const clickVisible = async (selector: string) => {
    await page.evaluate((sel) => {
      const element = Array.from(document.querySelectorAll(sel)).find((node) => {
        return node instanceof HTMLElement && (node.offsetWidth > 0 || node.offsetHeight > 0 || node.getClientRects().length > 0);
      });
      if (!(element instanceof HTMLElement)) {
        throw new Error(`click target not found: ${sel}`);
      }
      element.click();
    }, selector);
  };

  const expandSection = async (title: string) => {
    await page.evaluate((sectionTitle) => {
      const headers = Array.from(document.querySelectorAll('.card-header.gt-card-collapse'));
      const target = headers.find((header) => {
        const titleElement = header.querySelector('.card-title');
        const text = String(titleElement?.textContent ?? header.textContent ?? '').replace(/\s+/g, ' ').trim();
        return text.includes(sectionTitle);
      });
      if (!(target instanceof HTMLElement)) {
        throw new Error(`section header not found: ${sectionTitle}`);
      }
      const body = target.nextElementSibling;
      const isVisible =
        body instanceof HTMLElement &&
        (body.offsetWidth > 0 || body.offsetHeight > 0 || body.getClientRects().length > 0);
      if (!isVisible) {
        target.click();
      }
    }, title);
    await page.waitForTimeout(400);
  };

  const setInputValue = async (selector: string, value: string) => {
    await page.evaluate(({ sel, val }) => {
      const element = document.querySelector(sel);
      if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
        throw new Error(`input target not found: ${sel}`);
      }
      element.focus();
      element.value = '';
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.value = val;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, { sel: selector, val: value });
  };

  const setSelectValue = async (selector: string, value: string) => {
    await page.evaluate(({ sel, val }) => {
      const element = document.querySelector(sel);
      if (!(element instanceof HTMLSelectElement)) {
        throw new Error(`select target not found: ${sel}`);
      }
      const optionByValue = Array.from(element.options).find((option) => option.value === val);
      const optionByText = Array.from(element.options).find((option) => {
        return String(option.textContent ?? '').replace(/\s+/g, ' ').trim() === val;
      });
      const targetOption = optionByValue ?? optionByText;
      if (!targetOption) {
        throw new Error(`select option not found for ${sel}: ${val}`);
      }
      element.value = targetOption.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }, { sel: selector, val: value });
  };

  const inputValue = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        return element.value || '';
      }
      return '';
    }, selector);
  };

  const selectedText = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!(element instanceof HTMLSelectElement)) {
        return '';
      }
      return String(element.options[element.selectedIndex]?.textContent ?? '').replace(/\s+/g, ' ').trim();
    }, selector);
  };

  const elementText = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return String(element?.textContent ?? '').replace(/\s+/g, ' ').trim();
    }, selector);
  };

  const isVisible = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element instanceof HTMLElement && (element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0);
    }, selector);
  };

  const isChecked = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element instanceof HTMLInputElement ? element.checked : false;
    }, selector);
  };

  const checkedRadioValue = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element instanceof HTMLInputElement ? element.value : '';
    }, selector);
  };

  const waitForContains = async (selector: string, text: string, timeoutMs = 15000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const current = await elementText(selector);
      if (current.includes(text)) {
        return;
      }
      await page.waitForTimeout(250);
    }
    throw new Error(`Timed out waiting for ${selector} to contain "${text}"`);
  };

  const waitForValue = async (selector: string, value: string, timeoutMs = 15000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const current = await inputValue(selector);
      if (current === value) {
        return;
      }
      await page.waitForTimeout(250);
    }
    throw new Error(`Timed out waiting for ${selector} to equal "${value}"`);
  };

  const waitForChecked = async (selector: string, checked = true, timeoutMs = 10000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if ((await isChecked(selector)) === checked) {
        return;
      }
      await page.waitForTimeout(250);
    }
    throw new Error(`Timed out waiting for ${selector} checked=${checked}`);
  };

  const waitForFileRow = async (tableId: string, fileName: string, timeoutMs = 20000) => {
    const selector = `#${tableId} tbody`;
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const current = await elementText(selector);
      if (current.includes(fileName)) {
        return;
      }
      await page.waitForTimeout(500);
    }
    throw new Error(`Timed out waiting for ${fileName} in ${tableId}`);
  };

  const rowCount = async (selector: string) => {
    return page.evaluate((sel) => document.querySelectorAll(sel).length, selector);
  };

  const waitForDigitsValue = async (selector: string, digits: string, timeoutMs = 15000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const current = digitsOnly(await inputValue(selector));
      if (current === digits) {
        return;
      }
      await page.waitForTimeout(250);
    }
    throw new Error(`Timed out waiting for ${selector} digits to equal "${digits}"`);
  };

  const waitForSelectedText = async (selector: string, text: string, timeoutMs = 15000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const current = await selectedText(selector);
      if (current.includes(text)) {
        return;
      }
      await page.waitForTimeout(250);
    }
    throw new Error(`Timed out waiting for ${selector} selected text to contain "${text}"`);
  };

  const waitFor = async (predicate: () => Promise<boolean>, timeoutMs = 20000, intervalMs = 500, message = 'Timed out waiting for condition') => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      if (await predicate()) {
        return;
      }
      await page.waitForTimeout(intervalMs);
    }
    throw new Error(message);
  };

  const assert = (condition: unknown, message: string) => {
    if (!condition) {
      throw new Error(message);
    }
    checks.push(message);
  };

  const markStep = (message: string) => {
    currentStep = message;
    console.log(`[step] ${message}`);
  };

  const switchUser = async (userId: string) => {
    await clickVisible('#personalConfigMenu .dropdown-toggle');
    await page.waitForTimeout(300);
    await clickVisible('#switchUserButton');
    await page.waitForSelector('#switchUserModal', { state: 'visible', timeout: 10000 });
    await page.waitForTimeout(500);
    await page.locator('#switchUserModal .gt-agency select').nth(1).selectOption(OFFICE_ID);
    await page.waitForTimeout(500);
    await page.locator('#switchUserModal .gt-agency select').nth(2).selectOption(SECTION_ID);
    await page.waitForTimeout(800);
    await page.locator('#switchUserModal .user-combo').selectOption(userId);
    await clickVisible('#switchUserModal .confirm-switch-user');
    await page.waitForLoadState('domcontentloaded', 30000);
    await page.waitForTimeout(1000);
  };

  const approveWithTempCertIfNeeded = async () => {
    await clickVisible('.card-footer .btn-agree');
    await page.waitForTimeout(2000);
    const dialogText = await elementText('.swal2-popup');
    if (dialogText.includes('是否使用臨時憑證')) {
      await clickVisible('.swal2-popup .swal2-confirm');
      await page.waitForTimeout(8000);
    }
    const remainingDialog = await elementText('.swal2-popup');
    if (remainingDialog.includes('錯誤')) {
      throw new Error(`Unexpected dialog after agree: ${remainingDialog}`);
    }
  };

  const dismissSwalIfPresent = async () => {
    const dialogText = await elementText('.swal2-popup');
    if (!dialogText) {
      return;
    }
    const confirmVisible = await isVisible('.swal2-popup .swal2-confirm');
    if (confirmVisible) {
      await clickVisible('.swal2-popup .swal2-confirm');
      await page.waitForTimeout(800);
    }
  };

  const findReviewLinkByFormNo = async (
    indexUrl: string,
    formNo: string,
    hrefPattern: string,
    timeoutMs = 30000,
  ) => {
    let reviewLink = '';
    await waitFor(
      async () => {
        await page.goto(indexUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);
        await setInputValue(PENDING_FORM_NO_SELECTOR, formNo);
        await clickVisible('button[type="submit"]');
        await page.waitForLoadState('domcontentloaded', 30000);
        await page.waitForTimeout(2000);
        reviewLink = await page.evaluate(({ targetFormNo, pattern }) => {
          const rows = Array.from(document.querySelectorAll('table tbody tr'));
          for (const row of rows) {
            const text = String(row.textContent ?? '').replace(/\s+/g, ' ').trim();
            if (!text.includes(targetFormNo)) {
              continue;
            }
            const link = row.querySelector(`a[href*="${pattern}"]`);
            if (link instanceof HTMLAnchorElement) {
              return link.href;
            }
          }
          return '';
        }, { targetFormNo: formNo, pattern: hrefPattern });
        return reviewLink.length > 0;
      },
      timeoutMs,
      1000,
      `Timed out waiting for review item ${formNo} at ${indexUrl}`,
    );
    return reviewLink;
  };

  const findApproverEntryLinkByFormNo = async (formNo: string, timeoutMs = 30000) => {
    try {
      return await findReviewLinkByFormNo(TO_BE_SIGNED_URL, formNo, '/gt-app-form-to-be-signed/take/', timeoutMs);
    } catch {
      return findReviewLinkByFormNo(PENDING_URL, formNo, '/gt-app-form-pending/view/', timeoutMs);
    }
  };

  const countPendingRowsByFormNo = async (formNo: string) => {
    return page.evaluate((targetFormNo) => {
      return Array.from(document.querySelectorAll('table tbody tr')).filter((row) => {
        return String(row.textContent ?? '').replace(/\s+/g, ' ').trim().includes(targetFormNo);
      }).length;
    }, formNo);
  };

  const selectFirstAvailableOption = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!(element instanceof HTMLSelectElement)) {
        return { exists: false, value: '', text: '' };
      }

      const currentValue = String(element.value ?? '').trim();
      if (currentValue) {
        return {
          exists: true,
          value: currentValue,
          text: String(element.options[element.selectedIndex]?.textContent ?? '').replace(/\s+/g, ' ').trim(),
        };
      }

      const targetOption = Array.from(element.options).find((option) => {
        return !option.disabled && String(option.value ?? '').trim().length > 0;
      });
      if (!targetOption) {
        return { exists: true, value: '', text: '' };
      }

      element.value = targetOption.value;
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return {
        exists: true,
        value: String(targetOption.value ?? '').trim(),
        text: String(targetOption.textContent ?? '').replace(/\s+/g, ' ').trim(),
      };
    }, selector);
  };

  const selectableOptions = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!(element instanceof HTMLSelectElement)) {
        return [];
      }
      return Array.from(element.options)
        .filter((option) => !option.disabled && String(option.value ?? '').trim().length > 0)
        .map((option) => ({
          value: String(option.value ?? '').trim(),
          text: String(option.textContent ?? '').replace(/\s+/g, ' ').trim(),
        }));
    }, selector);
  };

  const nonEmptyOptionCount = async (selector: string) => {
    return page.evaluate((sel) => {
      const element = document.querySelector(sel);
      if (!(element instanceof HTMLSelectElement)) {
        return 0;
      }
      return Array.from(element.options).filter((option) => {
        return !option.disabled && String(option.value ?? '').trim().length > 0;
      }).length;
    }, selector);
  };

  const ensureBudgetItemSelected = async () => {
    const typeResult = await selectFirstAvailableOption('#type');
    if (!typeResult.exists || !typeResult.value) {
      throw new Error('Failed to resolve communicate budget type');
    }
    await page.waitForTimeout(700);

    const gateOptions = await selectableOptions('#gate');
    for (const gateOption of gateOptions) {
      await setSelectValue('#gate', gateOption.value);
      await page.waitForTimeout(700);

      const agencyOptions = await selectableOptions('#cbaAgency');
      for (const agencyOption of agencyOptions) {
        await setSelectValue('#cbaAgency', agencyOption.value);
        await page.waitForTimeout(1000);

        if ((await nonEmptyOptionCount('#budgetItem')) > 0) {
          const budgetItemResult = await selectFirstAvailableOption('#budgetItem');
          if (budgetItemResult.exists && budgetItemResult.value) {
            await page.waitForTimeout(1000);
            return;
          }
        }
      }
    }

    const budgetItemValue = await inputValue('#budgetItem');
    if (!budgetItemValue) {
      const budgetDiagnostics = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('#cba-budget select')).map((select) => {
          if (!(select instanceof HTMLSelectElement)) {
            return null;
          }
          return {
            id: select.id,
            name: select.name,
            value: select.value,
            visible: select.offsetWidth > 0 || select.offsetHeight > 0 || select.getClientRects().length > 0,
            options: Array.from(select.options).map((option) => ({
              value: option.value,
              text: String(option.textContent ?? '').replace(/\s+/g, ' ').trim(),
              disabled: option.disabled,
            })),
          };
        }).filter(Boolean);
      });
      throw new Error(`Failed to select communicate budget item: ${JSON.stringify(budgetDiagnostics, null, 2)}`);
    }
  };

  try {
    markStep('login');
    await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
    await setInputValue('input[name="account"]', 'admin');
    await setInputValue('input[name="mima"]', '1111');
    await clickVisible('button[type="submit"]');
    await page.waitForLoadState('domcontentloaded', 30000);
    await page.waitForTimeout(1000);

    markStep('switch applicant');
    await switchUser(APPLICANT_USER_ID);
    assert((await elementText('body')).includes('楊琇如您好'), 'switched applicant to 楊琇如');

    markStep('open add form');
    await page.goto(ADD_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await expandSection('通訊費明細');
    await expandSection('付款依據');
    await expandSection('經費來源');
    await expandSection('付款資訊');
    await expandSection('審核流程');

    const formNo = await inputValue('#gtAppFormNo');
    const draftUrl = await page.evaluate(() => location.href);
    const firstApproverSelector = 'select[name="prefers[0].signer.id"]';
    const firstApproverName = await selectedText(firstApproverSelector);
    const firstApproverDisplayName = resolveDisplayName(firstApproverName);
    const firstApproverUserId = await inputValue(firstApproverSelector);
    assert(firstApproverUserId.length > 0, 'first approver user id is resolved from review process');
    assert(firstApproverName.length > 0, 'first approver name is resolved from review process');
    assert(firstApproverDisplayName.length > 0, 'first approver display name is resolved from review process');

    assert((await elementText('body')).includes('分攤款'), 'applicant section renders 分攤款');
    assert((await elementText('body')).includes('報支類別'), 'applicant section renders 報支類別');
    assert(await page.evaluate(() => {
      const wrapper = document.querySelector('#reportType')?.closest('.row');
      const column = document.querySelector('#reportType')?.closest('.col-auto');
      const label = document.querySelector('label[for="reportType"]');
      const select = document.querySelector('#reportType');
      return (
        wrapper instanceof HTMLDivElement
        && column instanceof HTMLDivElement
        && label instanceof HTMLLabelElement
        && label.classList.contains('form-label')
        && label.classList.contains('required')
        && select instanceof HTMLSelectElement
        && select.classList.contains('form-select')
      );
    }), 'reportType layout matches temp-remun style');
    assert((await elementText('#communicateDetailsTable thead')).includes('用戶號碼'), 'detail table header uses 用戶號碼');
    assert(!(await elementText('body')).includes('繳費項目'), 'detail table no longer renders 繳費項目');
    await waitForChecked(APPORTION_FALSE_SELECTOR);
    assert(await isChecked(APPORTION_FALSE_SELECTOR), '分攤款 defaults to 否');

    const initialPayeeDefaults = {
      name: await inputValue(PAYEE_NAME_SELECTOR),
      bankNo: await inputValue(PAYEE_BANK_NO_SELECTOR),
      bankName: await inputValue(PAYEE_BANK_NAME_SELECTOR),
      account: await inputValue(PAYEE_ACCOUNT_SELECTOR),
      accountName: await inputValue(PAYEE_ACCOUNT_NAME_SELECTOR),
    };
    assert(initialPayeeDefaults.name.length > 0, 'COMMUNICATE default payee name is prefilled');
    assert(initialPayeeDefaults.bankNo.length > 0, 'COMMUNICATE default payee bankNo is prefilled');
    assert(initialPayeeDefaults.bankName.length > 0, 'COMMUNICATE default payee bankName is prefilled');
    assert(initialPayeeDefaults.account.length > 0, 'COMMUNICATE default payee account is prefilled');
    assert(initialPayeeDefaults.accountName.length > 0, 'COMMUNICATE default payee accountName is prefilled');

    markStep('verify report type linkage');
    await setSelectValue('#reportType', REPORT_TYPE_DATA);
    assert(!(await selectedText('#budgetUseTertiary')).includes('05 數據通訊費'), 'budget use stays unset before budgetItem is selected');
    await ensureBudgetItemSelected();
    await waitForSelectedText('#budgetUseTertiary', '05 數據通訊費');
    assert((await selectedText('#budgetUseTertiary')).includes('05 數據通訊費'), 'reportType=數據通訊費 defaults budget use to 20-09-05 after budgetItem selection');

    await setSelectValue('#reportType', REPORT_TYPE_GENERAL);
    await waitForSelectedText('#budgetUseTertiary', '10 一般通訊費');
    assert((await selectedText('#budgetUseTertiary')).includes('10 一般通訊費'), 'reportType=一般通訊費 defaults budget use to 20-09-10 after budgetItem selection');

    await setSelectValue('#reportType', REPORT_TYPE_DATA);
    await waitForSelectedText('#budgetUseTertiary', '05 數據通訊費');

    markStep('create first detail');
    await clickVisible('#btnAddCommunicateDetail');
    await page.waitForSelector('#communicateDetailModal', { state: 'visible', timeout: 10000 });
    await setInputValue('#communicateDetailChargeYearMonthInput', DETAIL_MONTH);
    await setInputValue('#communicateDetailPhoneNumberInput', DETAIL_PHONE_RAW);
    assert((await inputValue('#communicateDetailPhoneNumberInput')) === DETAIL_PHONE, '用戶號碼輸入時只保留數字');
    await setInputValue('#communicateDetailAmountInput', INITIAL_AMOUNT);
    await clickVisible('#communicateDetailSubmit');
    await page.waitForTimeout(1000);

    assert((await rowCount('#communicateDetails tr[data-sort]')) === 1, 'created first detail row');
    assert((await elementText('#communicateDetails')).includes(DETAIL_PHONE), 'detail row persists sanitized phone number');
    await waitForDigitsValue(PAYEE_AMOUNT_SELECTOR, INITIAL_AMOUNT);
    assert(digitsOnly(await inputValue('#communicateTotalAmount')) === INITIAL_AMOUNT, 'detail total reflects first detail amount');
    assert(digitsOnly(await inputValue(PAYEE_AMOUNT_SELECTOR)) === INITIAL_AMOUNT, 'payee amount auto-syncs from detail total');
    await waitForValue('#cba-budget input#note', EXPECTED_NOTE);
    assert((await inputValue('#cba-budget input#note')) === EXPECTED_NOTE, 'budget note defaults from division/reportType/phone/detail count');

    const contractCheckbox = CONTRACT_CHECKBOX_SELECTOR;
    const paymentCheckbox = PAYMENT_ATTACHES_CHECKBOX_SELECTOR;
    const registerCheckbox = REGISTER_OBJECT_CHECKBOX_SELECTOR;

    markStep('upload contract');
    assert(await isChecked(contractCheckbox), 'CONTRACT checkbox is checked by default');
    await clickVisible(contractCheckbox);
    await page.waitForTimeout(500);
    assert(await isChecked(contractCheckbox), 'CONTRACT checkbox cannot be unchecked while required');
    await dismissSwalIfPresent();
    await page.locator('#payment-contract-file').setInputFiles(UPLOAD_FILE);
    await waitForFileRow('payment-contract', 'waterMark.png');
    assert((await elementText('#payment-contract tbody')).includes('waterMark.png'), 'CONTRACT upload persisted in draft before save');

    markStep('toggle apportion');
    await clickVisible(APPORTION_TRUE_SELECTOR);
    await page.waitForTimeout(1000);
    assert(await isChecked(APPORTION_TRUE_SELECTOR), '分攤款 can switch to 是');
    assert(await isVisible('#register-object'), 'REGISTER_OBJECT uploader becomes visible when 分攤款=是');
    assert(await isChecked(registerCheckbox), 'REGISTER_OBJECT checkbox auto-checks when 分攤款=是');
    await clickVisible(registerCheckbox);
    await page.waitForTimeout(500);
    assert(await isChecked(registerCheckbox), 'REGISTER_OBJECT checkbox cannot be unchecked while required');
    await dismissSwalIfPresent();
    await page.locator('#register-object-file').setInputFiles(UPLOAD_FILE);
    await waitForFileRow('register-object', 'waterMark.png');
    assert((await elementText('#register-object tbody')).includes('waterMark.png'), 'REGISTER_OBJECT upload works when 分攤款=是');

    markStep('toggle advance payment');
    await setSelectValue(PAYEE_PAYMENT_TYPE_SELECTOR, ADVANCE_PAYMENT_TYPE_ID);
    await page.waitForTimeout(1500);
    assert(await isVisible('#payment-paper'), 'PURCHASE_BASIS uploader becomes visible when paymentType=代墊');
    assert(await isChecked(paymentCheckbox), 'PURCHASE_BASIS checkbox auto-checks when paymentType=代墊');
    await clickVisible(paymentCheckbox);
    await page.waitForTimeout(500);
    assert(await isChecked(paymentCheckbox), 'PURCHASE_BASIS checkbox cannot be unchecked while paymentType=代墊');
    await dismissSwalIfPresent();
    await page.locator('#payment-paper-file').setInputFiles(UPLOAD_FILE);
    await waitForFileRow('payment-paper', 'waterMark.png');
    assert((await elementText('#payment-paper tbody')).includes('waterMark.png'), 'PURCHASE_BASIS upload works when paymentType=代墊');

    markStep('reset general payment defaults');
    await setInputValue(PAYEE_NAME_SELECTOR, '覆寫受款人');
    await setInputValue(PAYEE_BANK_NO_SELECTOR, '9999999');
    await setInputValue(PAYEE_BANK_NAME_SELECTOR, '測試銀行');
    await setInputValue(PAYEE_ACCOUNT_SELECTOR, '999999');
    await setInputValue(PAYEE_ACCOUNT_NAME_SELECTOR, '測試戶名');
    await setSelectValue(PAYEE_PAYMENT_TYPE_SELECTOR, GENERAL_PAYMENT_TYPE_ID);
    await waitForValue(PAYEE_BANK_NO_SELECTOR, initialPayeeDefaults.bankNo);
    await waitForValue(PAYEE_BANK_NAME_SELECTOR, initialPayeeDefaults.bankName);
    await waitForValue(PAYEE_ACCOUNT_SELECTOR, initialPayeeDefaults.account);
    await waitForValue(PAYEE_ACCOUNT_NAME_SELECTOR, initialPayeeDefaults.accountName);
    await waitForValue(PAYEE_NAME_SELECTOR, initialPayeeDefaults.name);
    assert((await inputValue(PAYEE_BANK_NO_SELECTOR)) === initialPayeeDefaults.bankNo, 'switching paymentType back to 一般 reapplies bankNo default');
    assert((await inputValue(PAYEE_BANK_NAME_SELECTOR)) === initialPayeeDefaults.bankName, 'switching paymentType back to 一般 reapplies bankName default');
    assert((await inputValue(PAYEE_ACCOUNT_SELECTOR)) === initialPayeeDefaults.account, 'switching paymentType back to 一般 reapplies account default');
    assert((await inputValue(PAYEE_ACCOUNT_NAME_SELECTOR)) === initialPayeeDefaults.accountName, 'switching paymentType back to 一般 reapplies accountName default');
    assert((await inputValue(PAYEE_NAME_SELECTOR)) === initialPayeeDefaults.name, 'switching paymentType back to 一般 reapplies payee name default');

    markStep('save temp');
    await clickVisible('.btn-save-temp');
    await page.waitForTimeout(5000);
    await page.waitForLoadState('domcontentloaded', 30000);
    await page.waitForTimeout(1000);
    await expandSection('通訊費明細');
    await expandSection('付款依據');
    await expandSection('經費來源');
    await expandSection('付款資訊');
    await expandSection('審核流程');

    assert((await inputValue('#gtAppFormNo')) === formNo, '暫存後重開仍為同一張單');
    assert((await selectedText('#reportType')) === REPORT_TYPE_DATA, '暫存後報支類別仍為數據通訊費');
    assert(await isChecked(APPORTION_TRUE_SELECTOR), '暫存後分攤款=是 persisted');
    assert((await inputValue('#cba-budget input#note')) === EXPECTED_NOTE, '暫存後 budget note persisted');
    assert((await elementText('#payment-contract tbody')).includes('waterMark.png'), '暫存後 CONTRACT 附件 persisted');
    assert((await elementText('#payment-paper tbody')).includes('waterMark.png'), '暫存後 PURCHASE_BASIS 附件 persisted');
    assert((await elementText('#register-object tbody')).includes('waterMark.png'), '暫存後 REGISTER_OBJECT 附件 persisted');
    assert((await elementText('#communicateDetails')).includes(DETAIL_PHONE), '暫存後 detail row persisted');
    assert(digitsOnly(await inputValue(PAYEE_AMOUNT_SELECTOR)) === INITIAL_AMOUNT, '暫存後 payee amount remains synced to saved detail total');
    assert((await selectedText('#budgetUseTertiary')).includes('05 數據通訊費'), '暫存後 budget use persisted');

    markStep('edit saved detail');
    await clickVisible('#communicateDetails tr[data-sort="0"] button[data-action="edit"]');
    await page.waitForSelector('#communicateDetailModal', { state: 'visible', timeout: 10000 });
    await setInputValue('#communicateDetailAmountInput', UPDATED_AMOUNT);
    await clickVisible('#communicateDetailSubmit');
    await page.waitForTimeout(1000);
    await waitForDigitsValue(PAYEE_AMOUNT_SELECTOR, UPDATED_AMOUNT);
    assert(digitsOnly(await inputValue('#communicateTotalAmount')) === UPDATED_AMOUNT, 'editing saved detail updates detail total after reload');
    assert(digitsOnly(await inputValue(PAYEE_AMOUNT_SELECTOR)) === UPDATED_AMOUNT, 'editing saved detail keeps payee amount auto-sync active after reload');

    const persistedNote = await inputValue('#cba-budget input#note');
    const persistedPayeeAmount = await inputValue(PAYEE_AMOUNT_SELECTOR);

    markStep('submit applicant agree');
    await setSelectValue('select.gt-personal-process-combo', PERSONAL_PROCESS_ID);
    assert((await inputValue('select.gt-personal-process-combo')) === PERSONAL_PROCESS_ID, 'personal process was selected before applicant agree');
    await approveWithTempCertIfNeeded();
    await page.waitForTimeout(3000);

    markStep('switch first approver');
    await switchUser(firstApproverUserId);
    assert((await elementText('body')).includes(`${firstApproverDisplayName}您好`), `switched to first approver ${firstApproverName}`);

    markStep('open approver pending');
    const pendingLink = await findApproverEntryLinkByFormNo(formNo);
    assert(pendingLink.length > 0, 'first approver work list contains the submitted form');

    const result: ValidationResult = {
      formNo,
      draftUrl,
      firstApproverName,
      firstApproverDisplayName,
      firstApproverUserId,
      submittedPendingLink: pendingLink,
      checks,
      persisted: {
        note: persistedNote,
        payeeAmount: persistedPayeeAmount,
      },
    };

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    try {
      await page.screenshot({ path: '/tmp/communicate-stagehand-validation-failure.png', fullPage: true });
    } catch {
      // ignore screenshot failures
    }
    console.error(`[failed-step] ${currentStep}`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await stagehand.close();
  }
}

void main();
