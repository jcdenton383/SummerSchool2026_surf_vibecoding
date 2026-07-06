FROM golang:1.22-alpine AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o /out/mock-backend ./cmd/server

FROM alpine:3.20

RUN adduser -D -H appuser
WORKDIR /app
COPY --from=build /out/mock-backend /app/mock-backend
USER appuser

EXPOSE 8080
ENTRYPOINT ["/app/mock-backend"]
