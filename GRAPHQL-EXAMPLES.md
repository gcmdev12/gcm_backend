# GraphQL examples for the Next.js website and `/manage`

Endpoint: `/graphql`

## Admin login

```graphql
mutation {
  login(input: {
    email: "admin@glorychildrenministry.org"
    password: "YOUR_PASSWORD"
  }) {
    accessToken
    admin { id email firstName lastName role isActive }
  }
}
```

Use the returned token on every protected operation:

```text
Authorization: Bearer YOUR_TOKEN
```

## Dashboard

```graphql
query {
  dashboardStats {
    newContacts
    newVolunteers
    newSubscribers
    causes
    galleryItems
    newsArticles
  }
}
```

## Public contact form

```graphql
mutation {
  submitContactForm(input: {
    name: "Jane Doe"
    email: "jane@example.com"
    phone: "+256700000000"
    subject: "Partnership enquiry"
    message: "I would like to learn more about supporting the ministry."
  })
}
```

## Public volunteer form

```graphql
mutation {
  submitVolunteerForm(input: {
    name: "John Doe"
    email: "john@example.com"
    phone: "+256700000000"
    location: "Kampala"
    interests: "Mentoring and education"
    availability: "Weekends"
    experience: "Youth mentorship"
    message: "I would like to volunteer."
  })
}
```

## Newsletter

```graphql
mutation {
  subscribeNewsletter(input: {
    name: "Jane Doe"
    email: "jane@example.com"
  })
}
```

## Public website content

```graphql
query {
  siteSettings { siteName tagline email phone1 phone2 location whatsapp instagram facebook threads tiktok youtube }
  donationMethods { id name accountName accountNumber instructions logoUrl isActive sortOrder }
  causes { id slug name description imageUrl icon color isActive sortOrder }
  impactStatistics { id key label value description sortOrder }
  mediaAssets { id key page title altText url description }
  galleryItems { id title description imageUrl category isPublished sortOrder }
  newsArticles { id title slug excerpt content imageUrl published publishedAt createdAt }
}
```

## Admin submissions

```graphql
query {
  contactSubmissions { id name email phone subject message status createdAt }
  volunteerSubmissions { id name email phone location interests availability experience message status createdAt }
  newsletterSubscribers { id email name status subscribedAt }
  submissionSummary { contacts volunteers subscribers }
}
```

## Mark a contact as read

```graphql
mutation {
  updateContactSubmissionStatus(id: "SUBMISSION_ID", input: { status: READ }) {
    id
    status
  }
}
```

## Update site contact/social settings

```graphql
mutation {
  updateSiteSettings(input: {
    email: "info@glorychildrenministry.org"
    phone1: "+256..."
    phone2: "+256..."
    location: "Uganda"
    whatsapp: "https://wa.me/..."
    instagram: "https://instagram.com/..."
    facebook: "https://facebook.com/..."
    threads: "https://threads.net/@..."
    tiktok: "https://tiktok.com/@..."
    youtube: "https://youtube.com/@..."
  }) {
    id email phone1 phone2 location whatsapp instagram facebook threads tiktok youtube
  }
}
```

## Important frontend note

Do not expose `RESEND_API_KEY`, `JWT_SECRET`, or the Railway `DATABASE_URL` in the Next.js application. Only the GraphQL endpoint and the admin access token belong in frontend requests.
