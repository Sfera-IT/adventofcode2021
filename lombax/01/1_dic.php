<?php

$numbers = file_get_contents('./1_dic.txt');

$cnt = -1;
$prev = 0;
$n = explode("\n", $numbers);
foreach ($n as $key => $value) {
    $cnt += ((int)$value - (int)$prev) > 0 ? 1 : 0;
    $prev = $value;
}

echo $cnt."\n";

$prev = 0;
$cnt = -1;
for ($i = 2; $i < count($n); $i++) {
    $value = (int)$n[$i] + (int)$n[$i-1] + (int)$n[$i-2];
    $cnt += ((int)$value - (int)$prev) > 0 ? 1 : 0;
    $prev = $value;
}

echo $cnt."\n";