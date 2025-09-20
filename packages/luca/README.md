# Luca

Luca is a simple accounting engine that allows you to create and manage your accounts and transactions.

Based on the Double Entry Accounting System made by Luca Pacioli in the 15th century.

## Usage

```ts

```

## Architecture

Luca abstracts accounting into the following three concepts:

**Accounts** represent real accounting accounts (I know, I know, it's a bit of a stretch), they are hierarchical, meaning they can have child accounts that compose their parent account balance check [The accounting equation section](#the-accounting-equation) to understand how and whys.

**Transactions** represent the movement of money between accounts.

**Entries** represent rows in an account.

### The Accounting Equation

Uses the **Accounting Equation** as the foundation of the engine.

> Assets = Liabilities + Equity

This equation explains the relationship between the assets, liabilities and equity of a company and its divided into the following parts:

> **Assets** = `Liabilities + Equity`

> **Equity** = `Capital Contributions + Retained Earnings`

> **Retained Earnings** = `Opening Retained Earnings + Current Cycle Profit - Current Cycle Dividends`

> **Current Cycle Profit** = `Current Cycle Revenue - Current Cycle Expenses`

Making the **Expanded Accounting Equation**:

> **Assets** = `Liabilities + Capital Contributions + Opening Retained Earnings + Current Cycle Revenue - Current Cycle Expenses - Current Cycle Dividends`

We can rearange the equation to extract basic account types and their normal sides:

> **Current Cycle Expenses + Current Cycle Dividends + Assets** = `Liabilities + Capital Contributions + Opening Retained Earnings + Current Cycle Revenue`

This final equation explains how the left side of the equation is paied using the right side.

In a T account, the left side are DEBITS and the right side are CREDITS, making this equation arrangement match the T account structure.

> **Left side are DEBITS** = `Right side are CREDITS`

### Final and simplified equation

> **Expenses + Dividends + Assets** = `Liabilities + Capital Contributions + Earnings + Revenue`

## What this means for Luca?

**Luca** abstracts Accounts into a herarchical structure, where top accounts are composed of child accounts, and each child account has a normal side (DEBIT or CREDIT) that determines which side of the accounting equation the account belongs to (in a local scope).

An example of an account composed of 2 child accounts:

`Current Cycle Earnings` has 2 child accounts, `Current Cycle Expenses (DEBIT)` and `Current Cycle Revenue (CREDIT)`, meaning that the balance of `Current Cycle Earnings` is calculated as `Current Cycle Revenue (CREDIT) - Current Cycle Expenses (DEBIT)`, following the same rule as the accounting equation where the _left_ side are **DEBITS** and the _right_ side are **CREDITS**.

> This same logic is applied to all accounts.
