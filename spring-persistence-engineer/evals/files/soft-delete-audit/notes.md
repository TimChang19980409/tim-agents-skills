# Member Rollout Notes

- Need soft delete plus created and modified audit columns
- Existing production environments use Flyway
- Team does not want `spring.jpa.hibernate.ddl-auto=update` in production
- Uniqueness on email should only apply to active members
