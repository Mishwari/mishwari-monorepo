# Import Update Guide

## Types Migration Complete

All types have been moved to `@mishwari/types` package.

### Update all imports in passenger-web:

**Find and Replace:**

```
FROM: import { Trip } from '@/types/trip'
TO:   import { Trip } from '@mishwari/types'

FROM: import { Booking } from '@/types/booking'
TO:   import { Booking } from '@mishwari/types'

FROM: import { Passenger } from '@/types/passenger'
TO:   import { Passenger } from '@mishwari/types'

FROM: import { Profile } from '@/types/profileDetails'
TO:   import { Profile } from '@mishwari/types'

FROM: import { UserDetails } from '@/types/userDetails'
TO:   import { UserDetails } from '@mishwari/types'

FROM: import { Driver } from '@/types/driver'
TO:   import { Driver } from '@mishwari/types'

FROM: import { Bus } from '@/types/bus'
TO:   import { Bus } from '@mishwari/types'

FROM: import { Operator } from '@/types/operator'
TO:   import { Operator } from '@mishwari/types'
```

### After updating imports:

1. Delete `apps/passenger-web/src/types/` folder
2. Run `npm install` in root
3. Run `npm run dev` in passenger-web to test

## Next Steps

- [ ] Extract utils to `@mishwari/utils`
- [ ] Extract auth logic to `@mishwari/features-auth`
- [ ] Extract API client to `@mishwari/api`
