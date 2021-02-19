create table if not exists secrets (
    info varchar(2048) not null,
    pswd varchar(64) not null,
    link varchar(64) unique not null
);