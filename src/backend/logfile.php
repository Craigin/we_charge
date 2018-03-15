<?php

$modeMap = [
    'tail' => 'head',
    'head' => 'tail'
];

const DEFAULT_MODE = 'tail';
const DEFAULT_START = 0;
const DEFAULT_COUNT = 80;

$redirect = false;
$mode = null;
$mode1 = null;
$start = null;
$count = null;
if (isset($_GET['mode'])) {
    if ($_GET['mode'] === 'head' || $_GET['mode'] === 'tail') {
        $mode = $_GET['mode'];
        $mode1 = $modeMap[$mode];
    } else {
        $redirect = true;
        $mode = DEFAULT_MODE;
    }
} else {
    $redirect = true;
    $mode = DEFAULT_MODE;
}
if (isset($_GET['start'])) {
   $start = intval($_GET['start']);
} else {
    $redirect = true;
    $start = DEFAULT_START;
}
if (isset($_GET['count'])) {
    $count0 = intval($_GET['count']);
    if ($count0) {
        $count = $count0;
    } else {
        $redirect = true;
        $count = DEFAULT_COUNT;
    }
} else {
    $redirect = true;
    $count = DEFAULT_COUNT;
}

if ($redirect) {
    header("Location: ?mode=${mode}&start=${start}&count=${count}");
}

header('Content-Type: text/plain');
$path = realpath(trim(`pwd`) . '/../../server.log');

$count1 = $count;
$count = $start + $count;
echo "${mode} -n ${count} '${path}' | ${mode1} -n ${count1}\n\n";
echo `${mode} -n ${count} '${path}' | ${mode1} -n ${count1}`;

