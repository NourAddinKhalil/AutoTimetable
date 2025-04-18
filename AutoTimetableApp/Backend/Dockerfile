# Dockerfile للواجهة الخلفية
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AutoTimetableApi/AutoTimetableApi.csproj", "AutoTimetableApi/"]
RUN dotnet restore "AutoTimetableApi/AutoTimetableApi.csproj"
COPY . .
WORKDIR "/src/AutoTimetableApi"
RUN dotnet build "AutoTimetableApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "AutoTimetableApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AutoTimetableApi.dll"]
