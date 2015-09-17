<?php

class JsonUTF8 {

    public static function json_utf8_encode($input) {
        return preg_replace_callback ( "/&#(\\d+);/u", "self::_pcreEntityToUtf", json_encode(self::ascii_encode_all($input)) );
    }

    private static function ascii_encode_all($dat) {
        if (is_string($dat))
            return self::ascii_to_entities($dat);
        if (!is_array($dat) && !is_object($dat))
            return $dat;
        $ret = array();
        foreach ($dat as $i => $d)
            $ret[$i] = self::ascii_encode_all($d);
        return $ret;
    }


    private static function _pcreEntityToUtf($matches)
    {
        $char = intval(is_array($matches) ? $matches[1] : $matches);

        if ($char < 0x80)
        {
            // to prevent insertion of control characters
            if ($char >= 0x20) return htmlspecialchars(chr($char));
            else return "&#$char;";
        }
        if ($char < 0x8000)
            return chr(0xc0 | (0x1f & ($char >> 6))) . chr(0x80 | (0x3f & $char));
        return chr(0xe0 | (0x0f & ($char >> 12))) . chr(0x80 | (0x3f & ($char >> 6))). chr(0x80 | (0x3f & $char));
    }

    private static function ascii_to_entities($str) {
        $count = 1;
        $out = '';
        $temp = array();
        $str .= ' ';

        for ($i = 0, $s = strlen($str); $i < $s; $i++)
        {
            $ordinal = ord($str[$i]);
            if ($ordinal < 128)
            {
                if (count($temp) == 1)
                {
                    $out .= '&#' . array_shift($temp) . ';';
                    $count = 1;
                }
                $out .= $str[$i];
            }
            else
            {
                if (count($temp) == 0)
                    $count = ($ordinal < 224) ? 2 : 3;
                $temp[] = $ordinal;

                if (count($temp) == $count)
                {
                    $number = ($count == 3) ? (($temp['0'] % 16) * 4096) + (($temp['1'] % 64) * 64) + ($temp['2'] % 64) : (($temp['0'] % 32) * 64) + ($temp['1'] % 64);
                    $out .= '&#' . $number . ';';
                    $count = 1;
                    $temp = array();
                }
            }
        }
        return trim($out);

    }
}