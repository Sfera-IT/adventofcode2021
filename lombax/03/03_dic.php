<?php

//





$elements = file_get_contents('./03_dic.txt');

$element_array = explode("\n", $elements);

$most = '';
$least = '';

for ($i = 0; $i < strlen($element_array[0]); $i++) {
    $bits = '';
    for ($j = 0; $j < count($element_array); $j++) {
        $bits[$j] = $element_array[$j][$i];
    }

    $most[$i] = most_common_bit($bits);
    $least[$i] = least_common_bit($bits);


    var_dump($most);

}


var_dump(bindec($most) * bindec($least));







// array of bits
function most_common_bit($arr) {

    $zero = 0;
    $tot = 0;

    for ($i = 0; $i < strlen($arr); $i++) {
        if ($arr[$i] == '0') $zero++;
        $tot++;
    }

    $half = floor($tot / 2);
    if ($zero > $half)
        return '0';
    else
        return '1';

}

function least_common_bit($arr) {

    $zero = 0;
    $tot = 0;

    for ($i = 0; $i < strlen($arr); $i++) {
        if ($arr[$i] == '0') $zero++;
        $tot++;
    }

    $half = floor($tot / 2);
    if ($zero > $half)
        return '1';
    else
        return '0';

}





