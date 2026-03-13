# Merchant Alert Rules

- Database: PostgreSQL 17
- Reads: fetch active rules by merchant and channel thousands of times per minute
- Writes: low volume admin updates
- Need uniqueness by merchant, channel, and rule key
- Optional free-form notification metadata exists, but most predicates are on structured fields
