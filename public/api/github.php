<?php
header('Content-Type: application/json; charset=utf-8');

$configFile = __DIR__ . '/../../config/github.php';
$cacheFile = __DIR__ . '/../../cache/github-contributions.json';
$dureeCache = 3600;

function repondre($code, $donnees)
{
    http_response_code($code);
    echo json_encode($donnees);
    exit;
}

if (is_file($cacheFile) && time() - filemtime($cacheFile) < $dureeCache) {
    header('Cache-Control: public, max-age=3600');
    readfile($cacheFile);
    exit;
}

if (!is_file($configFile)) {
    repondre(500, ['error' => 'Configuration manquante']);
}

$config = require $configFile;

$requete = json_encode([
    'query' => 'query($login: String!) { user(login: $login) { contributionsCollection { contributionCalendar { weeks { contributionDays { date contributionCount } } } } } }',
    'variables' => ['login' => $config['user']],
]);

$contexte = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => implode("\r\n", [
            'Authorization: Bearer ' . $config['token'],
            'Content-Type: application/json',
            'User-Agent: sachalaville.fr',
        ]),
        'content' => $requete,
        'timeout' => 10,
        'ignore_errors' => true,
    ],
]);

$reponse = @file_get_contents('https://api.github.com/graphql', false, $contexte);
$donnees = $reponse ? json_decode($reponse, true) : null;
$weeks = $donnees['data']['user']['contributionsCollection']['contributionCalendar']['weeks'] ?? null;

if ($weeks === null) {
    if (is_file($cacheFile)) {
        readfile($cacheFile);
        exit;
    }
    repondre(502, ['error' => 'GitHub indisponible']);
}

$json = json_encode(['weeks' => $weeks]);

if (!is_dir(dirname($cacheFile))) {
    @mkdir(dirname($cacheFile), 0755, true);
}
@file_put_contents($cacheFile, $json);

header('Cache-Control: public, max-age=3600');
echo $json;
